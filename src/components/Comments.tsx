import { commentService } from '@/services/CommentService'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSession } from 'next-auth/react'
import React, { useEffect, useRef, useState } from 'react'

type Props = {
    videoId: string,
    data: any,
}

function Comments({ videoId, data }: Props) {
    const [comments, setComments] = useState([] as any[])
    const [comment, setComment] = useState("")
    const [focused, setFocused] = useState(false)
    useEffect(() => {
        (async () => {
            const comments = await commentService.getComments(videoId, data?.customUser?.access_token ?? "")
            console.log(comments)
            setComments(comments)
        })()
    }, [])
    return (
        <>
            <section
                className="comment flex flex-row items-center pt-3">
                <div className="comment-head">
                    <img
                        className={`avatar bg-black ${focused && "focused"}`}
                        src={data?.customUser?.avatar} />
                    <input
                        onFocus={() => setFocused(true)}
                        onBlur={() => { if (!comment) setFocused(false) }}
                        value={comment} onChange={e => setComment(e.target.value)}
                        type="text" placeholder="Write a comment..."
                        className={`w-full p-1 px-0 mx-3 border-b-black/30 border-b-2 ${focused && "focused"} comment-input`} />
                </div>
                <button
                    className={`comment-send ${focused ? "text-black" : "text-gray-400"}`}
                    onClick={async () => {
                        if (!data?.customUser || !comment) return
                        setFocused(false)
                        const content = comment
                        setComment("")
                        const successful = await commentService.createComment(videoId, content, data.customUser.access_token)
                        if (successful) {
                            const newComment = { id: Date.now(), content, commenter: data.customUser, videoId, commentedAt: new Date() }
                            setComments([...comments, newComment])
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </section>
            <section className="comments mt-12 mb-12">
                {comments.sort((a, b) => b.commentedAt.getTime() - a.commentedAt.getTime()).map(comment => (
                    <article key={comment.id}
                        className="flex flex-row mt-3"
                    >
                        <img
                            className="avatar mr-3"
                            src={comment.commenter.avatar} alt="" />
                        <div className="comment-body">
                            <h3
                                className="username font-bold"
                            >{comment.commenter.username}</h3>
                            <p>{comment.content}</p>
                        </div>
                    </article>
                ))}
            </section>
        </>
    )
}

export default Comments