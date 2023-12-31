import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { reactionService } from '@/services/ReactionService'
import { useSession } from 'next-auth/react'
import { subscriptionService } from '@/services/SubscriptionService'

type Props = {
    video: any
}

function MediaDescription({ video }: Props) {
    const [liked, setLiked] = useState(null as null | boolean)
    const [subscribed, setSubscribed] = useState(false)

    const { data } = useSession()
    const user = data?.customUser


    const subscribe = async () => {
        if (!user) return
        const newState = !subscribed
        const result = await subscriptionService.subscribe(video.creator.id, newState, user.access_token)
        if (result.successful) {
            setSubscribed(newState)
        }
    }

    const like = async () => {
        if (!user) return
        const result = await reactionService.reactVideo(video.id, true, user.access_token)
        if (result.successful) {
            setLiked(liked === true ? null : true)
        }
    }

    const dislike = async () => {
        if (!user) return
        const result = await reactionService.reactVideo(video.id, false, user.access_token)
        if (result.successful) {
            setLiked(liked === false ? null : false)
        }
    }
    useEffect(() => {
        setSubscribed(video.creator.subscribed)
        setLiked(video.liked)
    }, [video])

    return (
        <div
            className="pt-5"
        >
            <h3
                className="text-2xl font-semibold p-4 pl-0 video-title"
            >{video.title}</h3>
            <section
                className="flex flex-row pt-3 justify-between">
                <div className="flex flex-row items-center w-full justify-start">
                    <div className="creator w-full flex flex-row items-center py-2 pr-4">
                        <img
                            className="avatar"
                            src={video.creator.avatar} alt="" />
                        <div
                            className="avatar-details flex flex-col pl-3">
                            <h3
                                className="font-bold"
                            >{video.creator.username}</h3>
                            <span>200 subscribers</span>
                        </div>
                    </div>
                </div>
                <div className="reactions flex flex-col items-center ml-3 gap-2">
                    <div className="flex flex-row w-full justify-center gap-2">
                        <button onClick={dislike} className={`rounded-sm dislike ${liked === false ? "bg-black": ""}`}>
                            <FontAwesomeIcon className={`${liked === false ? "text-white" : "text-gray-400"}`} icon={faThumbsDown} />
                        </button>
                        <button onClick={like} className={`rounded-sm like ${liked === true ? "bg-black": ""}`}>
                            <FontAwesomeIcon className={`${liked === true ? "text-white" : "text-gray-400"}`} icon={faThumbsUp} />
                        </button>
                    </div>
                    <button
                        className={`${subscribed ? "text-white bg-black" : "text-gray-400"} subscribe-button rounded-sm font-semibold p-1`}
                        onClick={subscribe}
                    >{subscribed ? "SUBSCRIBED" : "SUBSCRIBE"}</button>
                </div>
            </section>
        </div>
    )
}

export default MediaDescription