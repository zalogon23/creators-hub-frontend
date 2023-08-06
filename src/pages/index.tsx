import React, { useState } from 'react'
import Scaffold from '../components/Scaffold'
import Header from '../components/Header'
import Shelf from '../components/Shelf'

type Props = {}

function Home({ }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  return (
    <Scaffold handleClick={() => setExpanded(false)} shelf>
      <Header {...{ expanded, setExpanded, loading }} />
      <Shelf />
    </Scaffold>
  )
}

export default Home