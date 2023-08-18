import Scaffold from '../../components/Scaffold'
import Header from '../../components/Header'
import MediaPlayer from '../../components/MediaPlayer'
import MediaDescription from '../../components/MediaDescription'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { videoService } from '@/services/VideoService'
import { useSession } from 'next-auth/react'
import Comments from '@/components/Comments'

function VideoScreen() {
    const { videoId } = useRouter().query
    const [video, setVideo] = useState(null as any)
    const [expanded, setExpanded] = useState(false)
    const { data, status } = useSession()
    useEffect(() => {
        (async () => {
            if (status == "loading") return
            const retrievedVideo = await videoService.getVideo(videoId as string, data?.customUser?.access_token)
            setVideo(retrievedVideo)
        })()
    }, [status])
    useEffect(() => {
        console.log(video)
    },)
    return (
        <Scaffold handleClick={() => setExpanded(false)} shelf>
            <Header {...{ expanded, setExpanded }} />
            {
                video && status != "loading"
                &&
                <>
                    <MediaPlayer url={video.url} thumbnail={video.thumbnail} />
                    <MediaDescription video={video} />
                    <Comments videoId={video.id} data={data} />
                </>
            }
        </Scaffold>
    )
}

export default VideoScreen