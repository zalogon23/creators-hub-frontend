import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

type Props = {}

function MediaDescription({ }: Props) {
    const [comment, setComment] = useState("")
    const [isCommentFocus, setIsCommentFocus] = useState(false)
    const focused = useRef(isCommentFocus)
    useEffect(() => {
        document.addEventListener("click", (e: MouseEvent) => {
            if (!(e.target as any).classList.contains("comment-input") && !(e.target as any).classList.contains("comment-send") && focused.current) {
                setIsCommentFocus(false)
            }
        })
    }, [])
    useEffect(() => {
        focused.current = isCommentFocus
    }, [isCommentFocus])
    return (
        <section
            className="pt-5"
        >
            <h3
                className="text-2xl font-semibold p-4 video-title"
            >Como hacerle una operación de hocico a una niña</h3>
            <section
                className="flex flex-row pt-3 justify-between">
                <div className="flex flex-row items-center w-full justify-start">
                    <div className="creator w-full flex flex-row items-center py-2 px-4">
                        <img
                            className="avatar"
                            src="https://familydoctor.org/wp-content/uploads/2018/02/41808433_l.jpg" alt="" />
                        <div
                            className="avatar-details flex flex-col pl-3">
                            <h3
                                className="font-bold"
                            >El DOC GUILLAO</h3>
                            <span>200 subscribers</span>
                        </div>
                    </div>
                </div>
                <div className="reactions flex flex-col items-center ml-3">
                    <div className="flex flex-row w-full">
                        <button className="dislike">
                            <FontAwesomeIcon icon={faThumbsDown} />
                        </button>
                        <button className="like">
                            <FontAwesomeIcon icon={faThumbsUp} />
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