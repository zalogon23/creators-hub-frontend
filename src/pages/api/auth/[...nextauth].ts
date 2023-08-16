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
            if (account) {
                token.access_token = account.access_token;
                token.refresh_token = account.refresh_token;
                token.expires_at = account.expires_at as number * 1000
                console.log("this current token is supposed to expire: " + token.expires_at)
                return token
            }


            if (Date.now() < (token.expires_at as number)) {
                return token
            }

            console.log("this current token is EXPIRED: " + new Date(token.expires_at as number) + " has been a long time ago.")
            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.customUser = null as any
            try {
                // Send properties to the client, like an access_token from a provider.
                if (token?.error) {
                    session.customUser.error = token?.error as boolean
                    return session
                }
                const user = await userService.getUser(token.access_token as string)
                console.log("this is the USER received: " + JSON.stringify(user))
                if (!user.message) {
                    session.customUser = user
                    session.customUser.access_token = token.access_token as string
                }
                return session;
            } catch (err) {
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
        console.log("the result of my refresh token: " + JSON.stringify(refreshedTokens))

        if (!refreshedTokens) {
            throw refreshedTokens
        }

        const refreshResponse = {
            ...token,
            access_token: refreshedTokens.access_token,
            expires_at: Date.now() + refreshedTokens.expires_in * 1000,
            refresh_token: refreshedTokens.refresh_token ?? token.refreshToken,
        }

        console.log("this is what i'm responding after my refresh to the token callback: " + JSON.stringify({ ...refreshResponse, expires_at: new Date(refreshResponse.expires_at) }))
        return refreshResponse
    } catch (error) {
        return {
            ...token,
            error: true,
        }
    }
}
