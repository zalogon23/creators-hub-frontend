import React from 'react'
import VideoCard from './VideoCard'

function Shelf() {
    const videos = [
        {
            title: "Como jugar a las cartas siendo ciego? Como jugar a las cartas siendo ciego?Como jugar a las cartas siendo ciego? Como jugar a las cartas siendo ciego?",
            duration: 63,
            thumbnail: "https://i.ytimg.com/vi/utX0yRJHiZ8/maxresdefault.jpg",
            id: "2f424f34f3r5f",
            creator: {
                id: "dfsdfsdfsdfsdfsd",
                avatar: "https://m.media-amazon.com/images/M/MV5BMTkzMDExOTIyOV5BMl5BanBnXkFtZTYwNTQ2MDM0._V1_FMjpg_UX1000_.jpg"
            }
        },
        {
            title: "Como jugar a las cartas siendo ciego? Como jugar a las cartas siendo ciego?Como jugar a las cartas siendo ciego? Como jugar a las cartas siendo ciego?",
            duration: 63,
            thumbnail: "https://i.ytimg.com/vi/utX0yRJHiZ8/maxresdefault.jpg",
            id: "2f424f34f3r5f",
            creator: {
                id: "dfsdfsdfsdfsdfsd",
                avatar: "https://m.media-amazon.com/images/M/MV5BMTkzMDExOTIyOV5BMl5BanBnXkFtZTYwNTQ2MDM0._V1_FMjpg_UX1000_.jpg"
            }
        },
        {
            title: "Como jugar a las cartas siendo ciego? Como jugar a las cartas siendo ciego?Como jugar a las cartas siendo ciego? Como jugar a las cartas siendo ciego?",
            duration: 63,
            thumbnail: "https://i.ytimg.com/vi/utX0yRJHiZ8/maxresdefault.jpg",
            id: "2f424f34f3r5f",
            creator: {
                id: "dfsdfsdfsdfsdfsd",
                avatar: "https://m.media-amazon.com/images/M/MV5BMTkzMDExOTIyOV5BMl5BanBnXkFtZTYwNTQ2MDM0._V1_FMjpg_UX1000_.jpg"
            }
        },
        {
            title: "Como jugar a las cartas siendo ciego? Como jugar a las cartas siendo ciego?Como jugar a las cartas siendo ciego? Como jugar a las cartas siendo ciego?",
            duration: 63,
            thumbnail: "https://i.ytimg.com/vi/utX0yRJHiZ8/maxresdefault.jpg",
            id: "2f424f34f3r5f",
            creator: {
                id: "dfsdfsdfsdfsdfsd",
                avatar: "https://m.media-amazon.com/images/M/MV5BMTkzMDExOTIyOV5BMl5BanBnXkFtZTYwNTQ2MDM0._V1_FMjpg_UX1000_.jpg"
            }
        }, {
            title: "Como jugar a las cartas siendo ciego? Como jugar a las cartas siendo ciego?Como jugar a las cartas siendo ciego? Como jugar a las cartas siendo ciego?",
            duration: 63,
            thumbnail: "https://i.ytimg.com/vi/utX0yRJHiZ8/maxresdefault.jpg",
            id: "2f424f34f3r5f",
            creator: {
                id: "dfsdfsdfsdfsdfsd",
                avatar: "https://m.media-amazon.com/images/M/MV5BMTkzMDExOTIyOV5BMl5BanBnXkFtZTYwNTQ2MDM0._V1_FMjpg_UX1000_.jpg"
            }
        }
    ]
    return (
        <section>
            <div className="videos flex flex-col gap-3">
                {videos.map((video, id) => (<VideoCard key={id} video={video} />))}
            </div>
        </section>
    )
}

export default Shelf