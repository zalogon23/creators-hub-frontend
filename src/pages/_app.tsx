import "../styles/Header.css"
import "../styles/MediaDescription.css"
import "../styles/MediaPlayer.css";
import "../styles/Scaffold.css"
import "../styles/Shelf.css"
import "../styles/VideoCard.css"
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"

export default function App({
  Component, pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
