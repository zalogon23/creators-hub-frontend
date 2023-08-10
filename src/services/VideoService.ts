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
    async getVideos(access_token: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/video`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        });
        const json = await response.json()
        return json.videos.map((video: any) => {
            return ({
                title: "Como jugar a las cartas siendo ciego? Como jugar a las cartas siendo ciego?Como jugar a las cartas siendo ciego? Como jugar a las cartas siendo ciego?",
                thumbnail: "https://i.ytimg.com/vi/utX0yRJHiZ8/maxresdefault.jpg",
                creator: {
                    id: video.creatorId,
                    avatar: "https://m.media-amazon.com/images/M/MV5BMTkzMDExOTIyOV5BMl5BanBnXkFtZTYwNTQ2MDM0._V1_FMjpg_UX1000_.jpg"
                },
                ...video
            })
        })
    }
    async getVideo(videoId: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/video/${videoId}`);
        const json = await response.json()
        const video = json.video
        console.log(video)
        return ({
            title: "Como jugar a las cartas siendo ciego? Como jugar a las cartas siendo ciego?Como jugar a las cartas siendo ciego? Como jugar a las cartas siendo ciego?",
            thumbnail: "https://i.ytimg.com/vi/utX0yRJHiZ8/maxresdefault.jpg",
            creator: {
                id: video.creatorId,
                avatar: "https://m.media-amazon.com/images/M/MV5BMTkzMDExOTIyOV5BMl5BanBnXkFtZTYwNTQ2MDM0._V1_FMjpg_UX1000_.jpg"
            },
            ...video
        })
    }
}

export const videoService = new VideoService()