import Scaffold from '../../components/Scaffold'
import Header from '../../components/Header'
import MediaPlayer from '../../components/MediaPlayer'
import MediaDescription from '../../components/MediaDescription'
import { useState } from 'react'
import { useRouter } from 'next/router'

function VideoScreen() {
    const { videoId } = useRouter().query
    const [expanded, setExpanded] = useState(false)
    const [loading, setLoading] = useState(false)
    return (
        <Scaffold handleClick={() => setExpanded(false)} shelf>
            <Header {...{ expanded, setExpanded, loading }} />
            <MediaPlayer />
            <MediaDescription />
        </Scaffold>
    )
}

export default VideoScreen