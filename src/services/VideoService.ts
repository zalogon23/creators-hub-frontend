class VideoService {
    async uploadVideo(video: any, access_token: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/video`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${access_token}`
            },
            body: video
        });
        const json = await response.json()
        return json
    }
    async getVideos(access_token: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/video`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        });
        const json = await response.json()
        return json.videos
    }
    async searchVideos(search: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/video/search/${search}`, {
            method: "GET"
        });
        const json = await response.json()
        return json.videos
    }
    async getVideo(videoId: string, access_token?: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/video/${videoId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        });
        const json = await response.json()
        const video = json.video
        console.log(video)
        return video
    }
}

export const videoService = new VideoService()