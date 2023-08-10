class VideoService {
    async uploadVideo(video: any, access_token: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/video`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${access_token}`,
            },
            body: video
        });
        const json = await response.json()
        return json
    }
    async getVideos(video: any, access_token: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/video`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`,
            },
            body: video
        });
        const json = await response.json()
        return json
    }
}

export const videoService = new VideoService()