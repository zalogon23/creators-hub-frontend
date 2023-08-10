import Scaffold from '../../components/Scaffold'
import Header from '../../components/Header'
import MediaPlayer from '../../components/MediaPlayer'
import MediaDescription from '../../components/MediaDescription'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { videoService } from '@/services/VideoService'

function VideoScreen() {
    const { videoId } = useRouter().query
    const [video, setVideo] = useState(null as any)
    const [expanded, setExpanded] = useState(false)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        (async () => {
            const retrievedVideo = await videoService.getVideo(videoId as string)
            setVideo(retrievedVideo)
        })()
    }, [])
    return (
        <Scaffold handleClick={() => setExpanded(false)} shelf>
            <Header {...{ expanded, setExpanded, loading }} />
            {
                video
                &&
                <>
                    <MediaPlayer url={video.url} />
                    <MediaDescription />
                </>
            }
        </Scaffold>
    )
}

export default VideoScreen