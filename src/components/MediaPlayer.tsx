import { faExpand, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
    url: string,
    thumbnail: string
};

function MediaPlayer({ url, thumbnail }: Props) {
    const [paused, setPaused] = useState(true);
    const [interacted, setInteracted] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [myTimeout, setMyTimeout] = useState(null as any as NodeJS.Timeout)

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
    const mounterRef = useRef(false);

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

        document.addEventListener("keydown", handleSpacebar)
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
        document.addEventListener("touchmove", handleMouseMove)
        document.addEventListener("touchend", handleMouseUp)

        return () => {
            document.removeEventListener("keydown", handleSpacebar);
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
            document.addEventListener("touchmove", handleMouseMove)
            document.addEventListener("touchend", handleMouseUp)
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
        if (mounterRef.current) return
        mounterRef.current = true
        initializeVideo();
        setupEventListeners()
    }, []);

    const getTimeRatio = (event: MouseEvent | TouchEvent) => {
        const barWidth = mediaRef.current!.offsetWidth;
        let mouseX: number
        if (event instanceof MouseEvent) {
            mouseX = event.pageX - mediaRef.current!.offsetLeft;
        } else {
            var touch = event.touches[0] || event.changedTouches[0]
            mouseX = touch.pageX
        }
        let ratio = (mouseX / barWidth);
        if (ratio > 1) ratio = 1
        if (ratio < 0) ratio = 0
        return ratio
    }

    const handleMouseUp = (event: MouseEvent | TouchEvent) => {
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

    const handleMouseMove = (event: MouseEvent | TouchEvent) => {
        console.log(draggingPlayerBarRef.current)
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

    const handleMouseDown = (event: TouchEvent | MouseEvent) => {
        isMouseDownRef.current = true
        draggingPlayerBarRef.current = true
        bar.current?.classList.add("dragging")
        videoRef.current!.pause()
        wasPausedRef.current = pausedRef.current
        handleMouseMove(event)
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

    const isMobile = () => {
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        } else {
            return false;
        }
    }

    const hide = () => {
        setHovered(false)
    }

    return (
        <div className="cont">
            <section
                ref={mediaRef}
                onMouseEnter={() => {
                    if (!isMobile()) {
                        setHovered(true)
                    }
                }}
                onMouseLeave={() => {
                    if (!isMobile()) {
                        setHovered(false)
                    }
                }}
                className="relative media-player"
            >
                <video
                    playsInline
                    onEnded={() => setPaused(true)}
                    ref={videoRef}
                    autoPlay
                    onClick={(e) => {
                        e.preventDefault()
                        console.log(myTimeout)
                        if (isMobile()) {
                            setHovered(h => !h)
                            if (myTimeout) clearTimeout(myTimeout)
                            setMyTimeout(setTimeout(hide, 1800))
                        } else {
                            toggle()
                        }
                    }}
                    poster={thumbnail}
                    src={url}
                >
                </video>
                <div className={`play alert ${!paused && !isMobile() && "active-alert"}`}>
                    <FontAwesomeIcon icon={faPlay} />
                </div>
                <div className={`pause alert ${interacted && !isMobile() && paused && "active-alert"}`}>
                    <FontAwesomeIcon icon={faPause} />
                </div>
                <div
                    onClick={() => { play(); console.log("play button") }}
                    className={`play alert ${paused && isMobile() && "fixed-alert"}`}>
                    <FontAwesomeIcon icon={faPlay} />
                </div>
                <div
                    onClick={() => pause()}
                    className={`pause alert ${interacted && hovered && isMobile() && !paused && "fixed-alert"}`}>
                    <FontAwesomeIcon icon={faPause} />
                </div>

                {
                    interacted
                    &&
                    <section
                        className={`${(paused && interacted) || (hovered && !paused) || draggingPlayerBarRef.current
                            ? "opacity-1"
                            : "opacity-0 pointer-events-none"
                            } bg-black/50 text-white w-full p-3 px-5 duration-150 absolute text-xl bottom-0 controls`}
                    >
                        <div
                            className="loading-bar"
                            ref={bar}
                            onMouseDown={(e) => handleMouseDown(e.nativeEvent)}
                            onTouchStart={(e) => handleMouseDown(e.nativeEvent)}
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