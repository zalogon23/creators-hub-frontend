import React, { useState } from 'react'
import Scaffold from '../components/Scaffold'
import Header from '../components/Header'
import Shelf from '../components/Shelf'
import FeedProvider from '@/contexts/FeedContext'

type Props = {}

function Home({ }: Props) {
  const [expanded, setExpanded] = useState(false)
  return (
    <FeedProvider>
      <Scaffold handleClick={() => setExpanded(false)} shelf>
        <Header />
        <Shelf />
      </Scaffold>
    </FeedProvider>
  )
}

export default Home