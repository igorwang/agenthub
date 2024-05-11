import NextAuth from "next-auth";

import Credentials from "next-auth/providers/credentials";
import Authentik from "next-auth/providers/authentik";

import { use } from "react";


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
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user, profile}) => {
      console.log("jwt callback");
      if (user) {
        console.log(user)
        console.log(profile)
        console.log(token)
        token.email = user.email;
        token.access_token = user.access_token;
      }
      return token;
    },
    session: async ({ session, token }) => {
      console.log("session callback");
      session.access_token = token.access_token;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});
