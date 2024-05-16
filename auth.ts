import NextAuth from "next-auth";

import Credentials from "next-auth/providers/credentials";
import Authentik from "next-auth/providers/authentik";
import { use } from "react";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials.email as string;
        const password = credentials.password as string;

        const loginData = {
          email: email,
          password: password,
        };
        const apiUrl = process.env.API_URL;
        const response = await fetch(`${apiUrl}/v1/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }).catch((error) => {
          console.error("Network error:", error);
          throw new Error(
            "Unable to connect to the server. Please try again later."
          );
        });
        const user = await response.json();
        if (response.status == 200) {
          return {
            email: email,
            access_token: user?.access_token,
          };
        }
        return null;
      },
    }),
    Authentik({
      clientId: process.env.AUTH_AUTHENTIK_CLIENT_ID,
      clientSecret: process.env.AUTH_AUTHENTIK_CLIENT_SECRET,
      issuer: process.env.AUTH_AUTHENTIK_ISSUER,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user, profile }) => {
      // console.log(1111);
      // console.log(token);
      // console.log(profile);
      // console.log(user);

      if (user) {
        console.log("User logged in:", user);
        const payload = {
          "https://hasura.io/jwt/claims": {
            "x-hasura-user-id": user.id,
            "x-hasura-role": "user",
            "x-hasura-default-role": "user",
            "x-hasura-allowed-roles": ["authentik Admins", "admin", "user"],
          },
          ...user,
        };
        const accessToken = jwt.sign(
          { ...payload },
          process.env.HASURA_API_SECRET as string,
          {
            algorithm: "HS256",
          }
        );
        token.email = user.email;
        token.access_token = accessToken;
        console.log(accessToken);
      }
      return token;
    },
    session: async ({ session, token }) => {
      console.log(token);
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});
