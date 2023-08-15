import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { reactionService } from '@/services/ReactionService'
import { useSession } from 'next-auth/react'

type Props = {
    video: any
}

function MediaDescription({ video }: Props) {
    const [comment, setComment] = useState("")
    const [isCommentFocus, setIsCommentFocus] = useState(false)
    const focused = useRef(isCommentFocus)
    const [liked, setLiked] = useState(null as null | boolean)

    const { data } = useSession()
    const user = data?.customUser

    const like = async () => {
        if (!user || liked) return
        const result = await reactionService.reactVideo(video.id, true, user.access_token)
        if (result.successful) {
            setLiked(true)
        }
    }

    const dislike = async () => {
        if (!user || !liked) return
        const result = await reactionService.reactVideo(video.id, false, user.access_token)
        if (result.successful) {
            setLiked(false)
        }
    }
    useEffect(() => {
        document.addEventListener("click", (e: MouseEvent) => {
            if (!(e.target as any).classList.contains("comment-input") && !(e.target as any).classList.contains("comment-send") && focused.current) {
                setIsCommentFocus(false)
            }
        })
    }, [])

    useEffect(() => {
        (async () => {
            if (user) {
                const result = await reactionService.getVideoReaction(video.id, user.access_token)
                console.log(result)
                if (result.message) return
                setLiked(result.reaction.liked)
            }
        })()
    }, [data])

    useEffect(() => {
        focused.current = isCommentFocus
    }, [isCommentFocus])
    return (
        <section
            className="pt-5"
        >
            <h3
                className="text-2xl font-semibold p-4 video-title"
            >{video.title}</h3>
            <section
                className="flex flex-row pt-3 justify-between">
                <div className="flex flex-row items-center w-full justify-start">
                    <div className="creator w-full flex flex-row items-center py-2 px-4">
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
                <div className="reactions flex flex-col items-center ml-3">
                    <div className="flex flex-row w-full">
                        <button onClick={dislike} className="dislike">
                            <FontAwesomeIcon className={`${liked === false ? "text-black" : "text-gray-400"}`} icon={faThumbsDown} />
                        </button>
                        <button onClick={like} className="like">
                            <FontAwesomeIcon className={`${liked === true ? "text-black" : "text-gray-400"}`} icon={faThumbsUp} />
                        </button>
                    </div>
                    <button
                        className="subscribe-button font-semibold p-1 px-3 w-full"
                    >SUBSCRIBE</button>
                </div>
            </section>
            <section className="comment flex flex-row items-center pt-3">
                <div className="comment-head">
                    <img
                        className="avatar"
                        src="https://familydoctor.org/wp-content/uploads/2018/02/41808433_l.jpg" alt="" />
                    <input
                        onFocus={() => setIsCommentFocus(true)}
                        value={comment} onChange={e => setComment(e.target.value)}
                        type="text" placeholder="Write a comment..."
                        className={`w-full p-1 px-0 ml-3 border-b-black/30 border-b-2 ${isCommentFocus && "focused"} comment-input`} />
                </div>
                {
                    isCommentFocus
                    &&
                    <button
                        className="comment-send"
                        onClick={() => setIsCommentFocus(false)}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                }
            </section>
            <section className="comments mt-12 mb-12">
                <article
                    className="flex flex-row mt-3"
                >
                    <img
                        className="avatar mr-3"
                        src="https://familydoctor.org/wp-content/uploads/2018/02/41808433_l.jpg" alt="" />
                    <div className="comment-body">
                        <h3
                            className="username font-bold"
                        >Pepe Gamboa</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore rerum nihil officiis non odio porro eligendi esse velit. Aliquam rerum quibusdam eum autem sed eos quaerat reprehenderit laudantium vitae sequi sunt delectus quo quod doloremque, soluta sint facilis repudiandae, a voluptate iure eligendi perferendis! Ab sint repellendus obcaecati. Molestias, hic.</p>
                    </div>
                </article>
                <article
                    className="flex flex-row mt-3"
                >
                    <img
                        className="avatar mr-3"
                        src="https://familydoctor.org/wp-content/uploads/2018/02/41808433_l.jpg" alt="" />
                    <div className="comment-body">
                        <h3
                            className="username font-bold"
                        >Pepe Gamboa</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore rerum nihil officiis non odio porro eligendi esse velit. Aliquam rerum quibusdam eum autem sed eos quaerat reprehenderit laudantium vitae sequi sunt delectus quo quod doloremque, soluta sint facilis repudiandae, a voluptate iure eligendi perferendis! Ab sint repellendus obcaecati. Molestias, hic.</p>
                    </div>
                </article>
            </section>
        </section>
    )
}

export default MediaDescription