import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index("subscription_by_user_ref"),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(q.Index("user_by_email"), q.Casefold(user.email))
                  )
                )
              ),
              q.Match(q.Index("subscription_by_status"), "active"),
            ])
          )
        );
        session.user.activeSubscription = userActiveSubscription;
        return session;
      } catch (e) {
        return  session;
      }
    },
    async signIn({ user }) {
      const { email } = user;

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(q.Index("user_by_email"), q.Casefold(user.email))
              )
            ),
            q.Create(q.Collection("users"), { data: { email } }),
            q.Get(
              // Select
              q.Match(
                q.Index("user_by_email"), // no fauna não consegue buscar informações sem indice
                q.Casefold(user.email)
              )
            )
          )
        );

        return true;
      } catch (e) {
        return false;
      }
    },
  },
});
