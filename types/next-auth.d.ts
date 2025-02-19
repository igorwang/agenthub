import "next-auth";
import "next-auth/jwt";
declare module "next-auth" {
  // Extending the built-in User model
  interface User {
    access_token?: string;
    email?: string;
    groups?: string[];
    avatar?: string;
    roles?: string[];
  }

  interface Session {
    access_token?: string;
  }

  interface Token {
    access_token?: string;
  }

  interface Profile {
    groups?: string[];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    access_token?: string;
    uid?: string;
    roles?: string[];
  }
}
