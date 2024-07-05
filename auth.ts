import NextAuth from "next-auth";

import { HasuraAdapter } from "@auth/hasura-adapter";
import jwt from "jsonwebtoken";
import Authentik from "next-auth/providers/authentik";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: HasuraAdapter({
    endpoint: process.env.HASURA_ENDPOINT ?? "",
    adminSecret: process.env.HASURA_ADMIN_SECRET ?? "",
  }),
  trustHost: true,
  providers: [
    // Credentials({
    //   name: "Credentials",
    //   credentials: {
    //     email: {
    //       label: "Email",
    //       type: "email",
    //       placeholder: "user@example.com",
    //     },
    //     password: { label: "Password", type: "password" },
    //   },
    //   authorize: async (credentials) => {
    //     const email = credentials.email as string;
    //     const password = credentials.password as string;

    //     const loginData = {
    //       email: email,
    //       password: password,
    //     };
    //     const apiUrl = process.env.API_URL;
    //     const response = await fetch(`${apiUrl}/v1/user/login`, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(loginData),
    //     }).catch((error) => {
    //       console.error("Network error:", error);
    //       throw new Error(
    //         "Unable to connect to the server. Please try again later."
    //       );
    //     });
    //     const user = await response.json();
    //     if (response.status == 200) {
    //       return {
    //         email: email,
    //         access_token: user?.access_token,
    //       };
    //     }
    //     return null;
    //   },
    // }),
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
    redirect: () => {
      return process.env.APP_HOST || "/chat";
    },
    jwt: async ({ token, user, profile }) => {
      if (user) {
        // console.log("User logged in:", user);
        // console.log("User profile:", profile);
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
          },
        );
        if (profile?.sub) {
          token.uid = user.id;
        }
        token.access_token = accessToken;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token.uid) {
        session.user.id = token.uid;
        session.user.avatar =
          token.picture ||
          "https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=Jasmine";
      }
      session.access_token = token.access_token as string;
      return session;
    },
  },
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  // pages: {
  //   signIn: "/auth/login",
  // },
});
