import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      activeSubscription?: object;
    } & DefaultSession["user"];
  }

  interface User {
    activeSubscription?: object;
  }
}
