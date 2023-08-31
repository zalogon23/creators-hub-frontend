import { faExpand, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

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
    const [isEnd, setIsEnd] = useState(false)
    const [isDragging, setIsDragging] = useState(false)

    const mediaRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const loading = useRef<HTMLDivElement>(null);
    const bar = useRef<HTMLDivElement>(null);
    const barPosition = useRef<HTMLDivElement>(null);
    const barTrail = useRef<HTMLDivElement>(null);

    const pausedRef = useRef<boolean>(paused);
    const interactedRef = useRef<boolean>(interacted);
    const hoveredRef = useRef<boolean>(hovered);
    const isMobileRef = useRef(isMobile);
    const myTimeoutRef = useRef(myTimeout);
    const isMouseDownRef = useRef<boolean>(false);
    const draggingPlayerBarRef = useRef<boolean>(false)
    const wasPausedRef = useRef<boolean>(true);
    const mounterRef = useRef(false);

    useEffect(() => { pausedRef.current = paused }, [paused])
    useEffect(() => { interactedRef.current = interacted }, [interacted])
    useEffect(() => { hoveredRef.current = hovered }, [hovered])
    useEffect(() => { isMobileRef.current = isMobile }, [isMobile])
    useEffect(() => { myTimeoutRef.current = myTimeout; console.log("timeout ID: " + myTimeout) }, [myTimeout])
    useEffect(() => { draggingPlayerBarRef.current = isDragging }, [isDragging])

    const updateProgressBar = () => {
        if (videoRef.current) {
            const currentTime = videoRef.current.currentTime;
            const duration = videoRef.current.duration;
            const proportion = (currentTime / duration);
            const width = isNaN(proportion) ? 0 : proportion * 100 ?? 0;
            loading.current!.style.width = width + "%";
        }
    };

    const cleanTimeout = () => {
        if (myTimeoutRef.current) clearTimeout(myTimeoutRef.current)
    }
    const resetTimeout = () => {
        cleanTimeout()
        const timeoutId = setTimeout(hide, 1800)
        setMyTimeout(timeoutId)
    }

    const pause = () => {
        wasPausedRef.current = true
        videoRef.current!.pause()
        setPaused(true)
        if (isMobile) {
            setHovered(true)
            cleanTimeout()
        }
    }
    const play = () => {
        wasPausedRef.current = false
        videoRef.current!.play()
        setPaused(false)
        setIsEnd(false)
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
            video.onloadeddata = () => {
                setInterval(() => {
                    updateProgressBar()
                }, 16)
            }
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
        const barWidth = barTrail.current!.offsetWidth;
        const leftOffset = mediaRef.current!.offsetLeft + ((mediaRef.current!.offsetWidth - barTrail.current!.offsetWidth) / 2)
        let mouseX: number
        
        if (event instanceof MouseEvent) {
            mouseX = event.pageX - leftOffset;
        } else {
            var touch = event.touches[0] || event.changedTouches[0]
            mouseX = touch.pageX - leftOffset;
        }
        
        let ratio = (mouseX / barWidth);
        if (ratio > 1) ratio = 1
        if (ratio < 0) ratio = 0
        return ratio
    }

    const handleMouseUp = (event: MouseEvent | TouchEvent) => {
        if (!barPosition.current || !draggingPlayerBarRef.current) return
        isMouseDownRef.current = false;
        setIsDragging(false);
        videoRef.current!.currentTime = getTimeRatio(event) * videoRef.current!.duration;

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
        if (mediaPlayerBarOnScreen && onBar && !isMobileRef.current) {
            event.preventDefault();
            barPosition.current!.style.width = getTimeRatio(event) * 100 + "%";
        }
        if (draggingPlayerBarRef.current) {
            event.preventDefault();
            videoRef.current!.currentTime = getTimeRatio(event) * videoRef.current!.duration;
        }
    };

    const handleMouseDown = (event: TouchEvent | MouseEvent) => {
        cleanTimeout()
        event.preventDefault()
        isMouseDownRef.current = true
        setIsDragging(true)
        if (!bar.current?.classList.contains("dragging")) bar.current?.classList.add("dragging")
        wasPausedRef.current = pausedRef.current
        videoRef.current!.pause()
        setPaused(true)
        if (isMobile) {
            setHovered(true)
        }
        handleMouseMove(event)
    }

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
                    onEnded={() => {
                        setIsEnd(true)
                        setPaused(true)
                    }}
                    ref={videoRef}
                    onPlay={() => play()}
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
                <div className={`play alert ${!paused && !isMobile && !isDragging && "active-alert"}`}>
                    <FontAwesomeIcon icon={faPlay} />
                </div>
                <div className={`pause alert ${interacted && !isMobile && paused && !isDragging && !isEnd && "active-alert"}`}>
                    <FontAwesomeIcon icon={faPause} />
                </div>
                <div
                    onClick={play}
                    className={`play alert ${((paused && isMobile && hovered) || (!interacted) || isEnd) && "fixed-alert"}`}>
                    <FontAwesomeIcon icon={faPlay} />
                </div>
                <div
                    onClick={pause}
                    className={`pause alert ${(interacted && hovered && isMobile && !paused) && "fixed-alert"}`}>
                    <FontAwesomeIcon icon={faPause} />
                </div>
                <section
                    className={`${((paused && !isMobile) || hovered || isDragging || isEnd) && interacted
                        ? "opacity-1"
                        : "opacity-0 pointer-events-none"
                        } bg-black/50 text-white w-full p-3 px-5 duration-150 absolute text-xl bottom-0 controls`}
                >
                    <div
                        className={`loading-bar ${isMobile ? "dragging-mobile" : ""}`}
                        ref={bar}
                        onMouseDown={(e) => handleMouseDown(e.nativeEvent)}
                        onTouchStart={(e) => handleMouseDown(e.nativeEvent)}
                        onClick={(e) => e.stopPropagation()}
                        onMouseLeave={() => {
                            barPosition.current!.style.width = "0%"
                        }}
                    >
                        <div ref={barPosition} className={`bar-position ${isMobile ? "invisible" : ""}`}></div>
                        <div ref={barTrail} className="bar-trail"></div>
                        <div ref={loading} className="loading"></div>
                    </div>
                    <button onClick={toggle}>
                        {paused ? <FontAwesomeIcon icon={faPlay} /> : <FontAwesomeIcon icon={faPause} />}
                    </button>
                    <button onClick={() => {
                        if (document.fullscreenElement == null) {
                            if (isMobile) {
                                videoRef.current!.requestFullscreen()
                            } else {
                                mediaRef.current!.requestFullscreen()
                            }
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