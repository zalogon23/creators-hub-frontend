import Link from "next/link"

type Props = {
    video: {
        title: string,
        duration: number,
        thumbnail: string,
        id: string,
        creator: {
            id: string,
            avatar: string
        }
    }
}

function VideoCard({ video }: Props) {
    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secondsFormat = (seconds % 60).toString().length == 1 ? "0" + (seconds % 60) : (seconds % 60)
        return minutes + ":" + secondsFormat
    }
    return (
        <article className="video-card rounded-lg overflow-hidden flex flex-col w-full relative">
            <div className="thumbnail relative">
                <img className="w-full h-full object-cover" src={video.thumbnail} alt="" />
                <span className="absolute">{formatDuration(video.duration)}</span>
            </div>
            <div className="details p-3">
                <Link href={`/user/${video.creator.id}`}>
                    <img className="w-12 h-12 rounded-full object-cover" src={video.creator.avatar} alt="" />
                </Link>
                <h3 className="ml-3 font-semibold text-sm">{video.title}</h3>
            </div>
            <Link className="absolute w-full h-full" href={`/video/${video.id}`}>
            </Link>
        </article>
    )
}

export default VideoCard