import UserProvider from '@/contexts/UserContext'
import "../styles/Header.css"
import "../styles/MediaDescription.css"
import "../styles/MediaPlayer.css";
import "../styles/Scaffold.css"
import "../styles/Shelf.css"
import "../styles/VideoCard.css"
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}
