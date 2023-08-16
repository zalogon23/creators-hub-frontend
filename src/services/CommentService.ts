class CommentService {
    async createComment(videoId: string, content: string, access_token: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/comment/${videoId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content
            })
        });
        const json = await response.json()
        return json?.successful
    }

    async getComments(videoId: string, access_token: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/comment/${videoId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        });
        const json = await response.json()
        console.log(json?.comments?.map((comment: any) => ({ ...comment, commentedAt: new Date(comment.commentedAt) })))
        return json?.comments?.map((comment: any) => ({ ...comment, commentedAt: new Date(comment.commentedAt) }))
    }
}

export const commentService = new CommentService()