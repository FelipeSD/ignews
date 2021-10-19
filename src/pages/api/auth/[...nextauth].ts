import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { query as q } from 'faunadb'
import { fauna } from '../../../services/fauna';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user'
    }),
  ],
  callbacks: {
    async signIn(user, account, profile){
      const {email} = user
      
      try{
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('users_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'), 
              { data: {email} }
            ),
            q.Get( // Select
              q.Match(
                q.Index('users_by_email'), // no fauna não consegue buscar informações sem indice
                q.Casefold(user.email)
              )
            )
          )
        )

        return true
      } catch(e) {
        return false
      }
    }
  }
})