import { faExpand, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { MouseEventHandler, createRef, useEffect, useRef, useState } from 'react';

type Props = {
    url: string,
    thumbnail: string
};

function MediaPlayer({ url, thumbnail }: Props) {
    const [paused, setPaused] = useState(true);
    const [interacted, setInteracted] = useState(false);
    const [hovered, setHovered] = useState(false);

    const mediaRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const loading = useRef<HTMLDivElement>(null);
    const bar = useRef<HTMLDivElement>(null);
    const barPosition = useRef<HTMLDivElement>(null);
    const pausedRef = useRef<boolean>(paused);
    const interactedRef = useRef<boolean>(interacted);
    const hoveredRef = useRef<boolean>(hovered);
    const videoDurationRef = useRef<number>(0);
    const videoPositionRef = useRef<number>(0);
    const isMouseDownRef = useRef<boolean>(false);
    const draggingPlayerBarRef = useRef<boolean>(false)
    const wasPausedRef = useRef<boolean>(true);

    const pause = () => {
        setPaused(true)
        wasPausedRef.current = true
    }
    const play = () => {
        setPaused(false)
        wasPausedRef.current = false
    }

    const toggle = () => {
        if (pausedRef.current) {
            play()
        }
        else {
            pause()
        }
    }

    const getTimePercentage = () => {
        const proportion = videoPositionRef.current / videoDurationRef.current;
        return isNaN(proportion) ? 0 : proportion * 100 ?? 0;
    }

    const setupEventListeners = () => {
        const handleSpacebar = (e: KeyboardEvent) => {
            if (e.code === "Space" && draggingPlayerBarRef.current) {
                e.preventDefault()
                return;
            }
            if (e.code === "Space" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
                e.preventDefault()
                toggle()
            }
        };

        document.addEventListener("keydown", handleSpacebar);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp)

        return () => {
            document.removeEventListener("keydown", handleSpacebar);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp)
        };
    }

    // Helper function for video initialization
    const initializeVideo = () => {
        const video = videoRef.current;

        if (video != null) {
            if (!video.paused) {
                play()
            }

            video.onloadeddata = () => {
                videoDurationRef.current = video.duration
                setInterval(() => {
                    videoPositionRef.current = video.currentTime;
                    if (loading.current) loading.current.style.width = `${getTimePercentage()}%`;
                }, 100);
            };
        }
    };

    useEffect(() => {
        initializeVideo();
        setupEventListeners()
    }, []);

    const getTimeRatio = (event: MouseEvent) => {
        const barWidth = mediaRef.current!.offsetWidth;
        const mouseX = event.pageX - mediaRef.current!.offsetLeft;
        let ratio = (mouseX / barWidth);
        if (ratio > 1) ratio = 1
        if (ratio < 0) ratio = 0
        return ratio
    }

    const handleMouseUp = (event: MouseEvent) => {
        if (!mediaRef.current || !barPosition.current || !draggingPlayerBarRef.current) return
        barPosition.current.style.width = "0%";
        isMouseDownRef.current = false;
        draggingPlayerBarRef.current = false;
        bar.current?.classList.remove("dragging")
        videoRef.current!.currentTime = getTimeRatio(event) * videoDurationRef.current;
        if (!wasPausedRef.current) {
            pausedRef.current = false
            videoRef.current!.play();
        }
    }

    const handleMouseMove = (event: MouseEvent) => {
        if (!mediaRef.current) return
        const mediaPlayerBarOnScreen = (pausedRef.current && interactedRef.current) || (hoveredRef.current && !pausedRef.current)
        const onBar = event.target == bar.current
        if (mediaPlayerBarOnScreen && onBar) {
            event.preventDefault();
            barPosition.current!.style.width = getTimeRatio(event) * 100 + "%";
        }
        if (draggingPlayerBarRef.current) {
            event.preventDefault();
            videoRef.current!.currentTime = getTimeRatio(event) * videoDurationRef.current;
            loading.current!.style.width = `${getTimePercentage()}%`;
        }
    };

    const handleMouseDown: MouseEventHandler<HTMLDivElement> = (event) => {
        isMouseDownRef.current = true
        draggingPlayerBarRef.current = true
        bar.current?.classList.add("dragging")
        videoRef.current!.pause()
        wasPausedRef.current = pausedRef.current
        handleMouseMove(event as any as MouseEvent)
    }

    useEffect(() => {
        pausedRef.current = paused;
        if (paused) {
            videoRef.current?.pause();
        } else {
            if (!interacted) {
                setInteracted(true);
                interactedRef.current = true
            }
            videoRef.current?.play();
        }
    }, [paused]);

    return (
        <div className="cont">
            <section
                ref={mediaRef}
                onMouseEnter={() => {
                    setHovered(true)
                    hoveredRef.current = true
                }}
                onMouseLeave={() => {
                    setHovered(false)
                    hoveredRef.current = false
                }}
                className="relative media-player"
            >
                <video
                    onEnded={() => setPaused(true)}
                    ref={videoRef}
                    autoPlay
                    onClick={toggle}
                    poster={thumbnail}
                    src={url}
                >
                </video>
                <div className={`play alert ${!paused && "active-alert"}`}>
                    <FontAwesomeIcon icon={faPlay} />
                </div>
                <div className={`pause alert ${interacted && paused && "active-alert"}`}>
                    <FontAwesomeIcon icon={faPause} />
                </div>
                {
                    interacted
                    &&
                    <section
                        className={`${(paused && interacted) || (hovered && !paused) || draggingPlayerBarRef.current
                            ? "opacity-1"
                            : "opacity-0"
                            } bg-black/50 text-white w-full p-3 px-5 duration-150 absolute text-xl bottom-0 controls`}
                    >
                        <div
                            className="loading-bar"
                            ref={bar}
                            onMouseDown={handleMouseDown}
                            onMouseLeave={() => {
                                barPosition.current!.style.width = "0%"
                            }}
                        >
                            <div ref={barPosition} className="bar-position"></div>
                            <div className="bar-trail"></div>
                            <div ref={loading} className="loading"></div>
                        </div>
                        <button onClick={toggle}>
                            {paused ? <FontAwesomeIcon icon={faPlay} /> : <FontAwesomeIcon icon={faPause} />}
                        </button>
                        <button onClick={() => {
                            if (document.fullscreenElement == null) {
                                mediaRef.current!.requestFullscreen()
                            } else {
                                document.exitFullscreen()
                            }
                        }}>
                            <FontAwesomeIcon icon={faExpand} />
                        </button>
                    </section>
                }
            </section>
        </div>
    );
}

export default MediaPlayer;