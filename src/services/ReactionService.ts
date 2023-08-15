class ReactionService {
    async reactVideo(videoId: string, liked: boolean, access_token: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/video/react/${videoId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                liked
            })
        });
        const json = await response.json()
        return json
    }

    async getVideoReaction(videoId: string, access_token: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/video/react/${videoId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        });
        const json = await response.json()
        return json
    }
}

export const reactionService = new ReactionService()