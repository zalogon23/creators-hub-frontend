import { videoService } from "@/services/VideoService"
import { useSession } from "next-auth/react"
import { ReactNode, createContext, useEffect, useState } from "react"

interface FeedContext {
    videos: any[],
    search: (value: string) => void
}

export const feedContext = createContext({ videos: [] } as any as FeedContext)

interface Props {
    children: ReactNode
}

export default function FeedProvider({ children }: Props) {
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
        <feedContext.Provider value={{
            videos,
            search: async (value: string) => {
                const videos = await videoService.searchVideos(value)
                setVideos(videos)
            }
        }}>
            {children}
        </feedContext.Provider>
    )
}