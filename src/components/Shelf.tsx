import React, { useEffect, useState } from 'react'
import VideoCard from './VideoCard'
import { videoService } from '@/services/VideoService'
import { useSession } from 'next-auth/react'

function Shelf() {
    const [videos, setVideos] = useState([])
    const { data } = useSession()
    useEffect(() => {
        (async () => {
            if (data?.customUser && data?.customUser?.id) {
                const myVideos = await videoService.getVideos(data.customUser?.id)
                console.log("these are the videos: " + JSON.stringify(videos))
                setVideos(myVideos)
            }
        })()
    }, [data])
    return (
        <section>
            <div className="videos flex flex-col gap-3">
                {videos.map((video: any) => (<VideoCard key={video.id} video={video} />))}
            </div>
        </section>
    )
}

export default Shelf