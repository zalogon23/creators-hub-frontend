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
    const [isMobile, setIsMobile] = useState(false)

    const mediaRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const loading = useRef<HTMLDivElement>(null);
    const bar = useRef<HTMLDivElement>(null);
    const barPosition = useRef<HTMLDivElement>(null);

    const pausedRef = useRef<boolean>(paused);
    const interactedRef = useRef<boolean>(interacted);
    const hoveredRef = useRef<boolean>(hovered);
    const isMobileRef = useRef(isMobile);
    const myTimeoutRef = useRef(myTimeout);
    const videoDurationRef = useRef<number>(0);
    const videoPositionRef = useRef<number>(0);
    const isMouseDownRef = useRef<boolean>(false);
    const draggingPlayerBarRef = useRef<boolean>(false)
    const wasPausedRef = useRef<boolean>(true);
    const mounterRef = useRef(false);

    useEffect(() => { pausedRef.current = paused }, [paused])
    useEffect(() => { interactedRef.current = interacted }, [interacted])
    useEffect(() => { hoveredRef.current = hovered }, [hovered])
    useEffect(() => { isMobileRef.current = isMobile }, [isMobile])
    useEffect(() => { myTimeoutRef.current = myTimeout; console.log("timeout ID: " + myTimeout) }, [myTimeout])

    const cleanTimeout = () => {
        console.log("timeout clean ID: " + myTimeoutRef.current)
        if (myTimeoutRef.current) clearTimeout(myTimeoutRef.current)
    }
    const resetTimeout = () => {
        cleanTimeout()
        const timeoutId = setTimeout(hide, 1800)
        setMyTimeout(timeoutId)
    }

    const pause = () => {
        wasPausedRef.current = true
        setPaused(true)
        if (isMobile) {
            setHovered(true)
            cleanTimeout()
        }
    }
    const play = () => {
        wasPausedRef.current = false
        setPaused(false)
        if (isMobileRef.current && interactedRef.current) {
            setHovered(true)
            resetTimeout()
        } else if (isMobileRef.current && !interactedRef.current) {
            hide()
        }
        setInteracted(true)
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
        document.addEventListener("mousemove", handleMouseMove, { passive: false })
        document.addEventListener("mouseup", handleMouseUp)
        document.addEventListener("touchmove", handleMouseMove, { passive: false })
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
        setIsMobile(getIsMobile())
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
        if (!barPosition.current || !draggingPlayerBarRef.current) return
        isMouseDownRef.current = false;
        draggingPlayerBarRef.current = false;
        videoRef.current!.currentTime = getTimeRatio(event) * videoDurationRef.current;
        console.log(wasPausedRef)
        if (!wasPausedRef.current) {
            play()
        }
        if (!isMobileRef.current) {
            bar.current?.classList.remove("dragging")
        }
    }

    const handleMouseMove = (event: MouseEvent | TouchEvent) => {
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
        cleanTimeout()
        event.preventDefault()
        isMouseDownRef.current = true
        draggingPlayerBarRef.current = true
        if (!bar.current?.classList.contains("dragging")) bar.current?.classList.add("dragging")
        wasPausedRef.current = pausedRef.current
        setPaused(true)
        handleMouseMove(event)
    }

    useEffect(() => {
        if (paused) {
            videoRef.current?.pause();
        } else {
            videoRef.current?.play();
        }
    }, [paused]);

    const getIsMobile = () => {
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
        console.log("HIDE triggered")
        setHovered(false)
    }

    return (
        <div className="cont">
            <section
                ref={mediaRef}
                onMouseEnter={() => {
                    if (!isMobile) {
                        setHovered(true)
                    }
                }}
                onMouseLeave={() => {
                    if (!isMobile) {
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
                        if (isMobile) {
                            if (!paused && !hovered) {
                                resetTimeout()
                            } else {
                                cleanTimeout()
                            }
                            setHovered(!hovered)
                        } else {
                            toggle()
                        }
                    }}
                    poster={thumbnail}
                    src={url}
                >
                </video>
                <div className={`play alert ${!paused && !isMobile && "active-alert"}`}>
                    <FontAwesomeIcon icon={faPlay} />
                </div>
                <div className={`pause alert ${interacted && !isMobile && paused && "active-alert"}`}>
                    <FontAwesomeIcon icon={faPause} />
                </div>
                <div
                    onClick={play}
                    className={`play alert ${(paused && isMobile) && "fixed-alert"}`}>
                    <FontAwesomeIcon icon={faPlay} />
                </div>
                <div
                    onClick={pause}
                    className={`pause alert ${(interacted && hovered && isMobile && !paused) && "fixed-alert"}`}>
                    <FontAwesomeIcon icon={faPause} />
                </div>
                <section
                    className={`${((paused && !isMobile) || hovered || draggingPlayerBarRef.current) && interacted
                        ? "opacity-1"
                        : "opacity-0 pointer-events-none"
                        } bg-black/50 text-white w-full p-3 px-5 duration-150 absolute text-xl bottom-0 controls`}
                >
                    <div
                        className={`loading-bar ${isMobile ? "dragging-mobile" : ""}`}
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
            </section>
        </div>
    );
}

export default MediaPlayer;