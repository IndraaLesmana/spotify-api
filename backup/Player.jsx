import React, {
    useEffect,
    useState
} from 'react'
import {
    PlayCircleIcon,
    PauseCircleIcon
} from '@heroicons/react/24/solid'
import {
    useSession
} from 'next-auth/react'
// import fetch from 'node-fetch'

export const Player = ({
        globalCurrentSongId,
        setGlobalCurrentSongId,
        globalIsTrackPlaying,
        setGlobalIsTrackPlaying
    }) => {
        const {
            data: session
        } = useSession()

        const [songInfo, setSongInfo] = useState(null)

        async function fetchSongInfo(trackId) {
            if (trackId) {
                const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`
                    }
                })
                const data = await res.json()
                setSongInfo(data)
            }

        }

        async function getCurrentlyPlaying() {
            const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`
                }
            })
            if (res.status == 204) {
                console.log('204 response')
                return;
            }
            const data = await res.json()
            return data
        }

        async function handlePlayPause() {
            if (session && session.accessToken) {
                const data = await getCurrentlyPlaying()
                if (data.is_playing) {
                    const res = await fetch("https://api.spotify.com/v1/me/player/pause", {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`
                        }
                    })
                    if (res.status == 204) {
                        setGlobalIsTrackPlaying(false)
                    }
                } else {
                    const res = await fetch("https://api.spotify.com/v1/me/player/play", {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`
                        },
                    })
                    if (res.status == 204) {
                        setGlobalIsTrackPlaying(true)
                        setGlobalCurrentSongId(data.item.id)
                    }
                    // <audio src="https://p.scdn.co/mp3-preview/3555c6200a0ab12b967d3df1e17197155aa16ec0?cid=fb9263d085694fe4a5a37c9caff3a69c"></audio>
                }
            }
        }

        useEffect(() => {
            async function f() {
                if (session && session.accessToken) {
                    if (!globalCurrentSongId) {
                        const data = await getCurrentlyPlaying()
                        setGlobalCurrentSongId(data?.item?.id)
                        if (data.is_playing) {
                            setGlobalIsTrackPlaying(true)
                        }
                        await fetchSongInfo(data?.item?.id)
                    } else {
                        await fetchSongInfo(globalCurrentSongId)
                    }
                }
            }
            f()
        }, [globalCurrentSongId])

        return ( <
            div className = 'h-24 bg-neutral-800 border-t border-neutral-700 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8' >
            <
            div className = "flex items-center space-x-4" > {
                songInfo?.album.images[0].url && < img className = 'hidden md:inline h-10 w-10'
                src = {
                    songInfo?.album.images[0].url
                }
                />} <
                div className = "" >
                <
                p className = 'text-white text-sm' > {
                    songInfo?.name
                } < /p> <
                p className = 'text-neutral-400 text-xs' > {
                    songInfo?.artists[0]?.name
                } < /p> <
                /div> <
                /div> <
                div className = "flex items-center justify-center" > {
                    globalIsTrackPlaying ? < PauseCircleIcon onClick = {
                        handlePlayPause
                    }
                    className = "h-10 w-10" / > : < PlayCircleIcon onClick = {
                        handlePlayPause
                    }
                    className = "h-10 w-10" / >
                } <
                /div> <
                div className = "" > < /div> <
                /div>
            )
        }