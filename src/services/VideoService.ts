class VideoService {
    async uploadVideo(video: any) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/video`, {
            method: "POST",
            body: video
        });
        const json = await response.json()
        return json
    }
}

export const videoService = new VideoService()