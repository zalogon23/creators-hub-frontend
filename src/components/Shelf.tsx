import React, { useContext } from 'react'
import VideoCard from './VideoCard'
import { feedContext } from '@/contexts/FeedContext'

function Shelf() {
    const { videos } = useContext(feedContext)
    return (
        <section>
            <div className="videos flex flex-col gap-3">
                {videos.map((video: any) => (<VideoCard key={video.id} video={video} />))}
            </div>
        </section>
    )
}

export default Shelf