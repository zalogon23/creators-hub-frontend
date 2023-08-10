import { UserDTO } from '@/dtos/UserDTO';
import { userService } from '@/services/UserService';
import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google'


const GOOGLE_AUTHORIZATION_URL =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
    })

export default NextAuth({
    secret: "secretetetetteteteeteteteteteeeeeeeeeee",
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: GOOGLE_AUTHORIZATION_URL
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            console.log("account: " + JSON.stringify(account))
            console.log("user: " + JSON.stringify(user))
            console.log("token: " + JSON.stringify(token))
            if (account) {
                token.access_token = account.access_token;
                token.refresh_token = account.refresh_token;
                token.expires_at = account.expires_at
                console.log("Getting token, first time: " + JSON.stringify(token))
                return token
            }

            if (Date.now() / 1000 < (token.expires_at as number)) {
                return token
            }

            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.customUser = {} as UserDTO
            try {
                // Send properties to the client, like an access_token from a provider.
                console.log("This is the token: " + JSON.stringify(token))
                if (token?.error) {
                    console.log("THERE IS AN ERROR WITH THIS TOKEN")
                    session.customUser.error = token?.error as boolean
                    return session
                }
                session.customUser = await userService.getUser(token.access_token as string)
                session.customUser.access_token = token.access_token as string
                console.log("This is the user: " + JSON.stringify(session.customUser))
                return session;
            } catch (err) {
                session.customUser.error = true
                console.log(err)
                return session
            }
        },
    },
})

async function refreshAccessToken(token: JWT) {
    try {
        const url =
            "https://oauth2.googleapis.com/token?" +
            new URLSearchParams({
                client_id: (process.env.GOOGLE_CLIENT_ID as string),
                client_secret: (process.env.GOOGLE_CLIENT_SECRET as string),
                grant_type: "refresh_token",
                refresh_token: (token.refresh_token as string),
            })

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
        })

        const refreshedTokens = await response.json()
        console.log("the result from the refresh token: " + JSON.stringify(refreshedTokens))

        if (!response.ok) {
            throw refreshedTokens
        }

        return {
            ...token,
            access_token: refreshedTokens.access_token,
            expires_at: refreshedTokens.expires_at,
            refresh_token: refreshedTokens.refresh_token ?? token.refreshToken,
        }
    } catch (error) {
        console.log("error: " + JSON.stringify(error))

        return {
            ...token,
            error: true,
        }
    }
}
