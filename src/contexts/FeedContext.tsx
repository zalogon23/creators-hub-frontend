import { videoService } from "@/services/VideoService"
import { useSession } from "next-auth/react"
import { ReactNode, createContext, useEffect, useState } from "react"
import { toast } from "react-toastify"

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
    const { data, status } = useSession()
    useEffect(() => {
        (async () => {
            if (status != "loading") {
                const myVideos = await videoService.getVideos(data?.customUser?.id ?? "")
                console.log("these are the videos: " + JSON.stringify(videos))
                setVideos(myVideos)
            }
        })()
    }, [status])
    return (
        <feedContext.Provider value={{
            videos,
            search: async (value: string) => {
                const videos = await videoService.searchVideos(value)
                if (videos.length < 1) {
                    toast.warning("There are no videos for such search.", {
                        autoClose: 3000
                    })
                    return
                }
                setVideos(videos)
            }
        }}>
            {children}
        </feedContext.Provider>
    )
}