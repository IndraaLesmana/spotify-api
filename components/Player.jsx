import React, { useEffect, useState } from 'react'
import { PlayCircleIcon, PauseCircleIcon, ForwardIcon, BackwardIcon } from '@heroicons/react/24/solid'
import { useSession } from 'next-auth/react'
// import fetch from 'node-fetch'

export const Player = ({ globalCurrentSongId, setGlobalCurrentSongId, globalIsTrackPlaying, setGlobalIsTrackPlaying }) => {
    const { data: session } = useSession()

    const [audio, setAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
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
        try {
            const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`
                }
            });
            const data = await res.json();

            // Check if data contains the expected structure
            if (data && data.item && data.item.id) {
                return data;
            } else {
                console.log('No currently playing track found.');
                return null;
            }
        } catch (error) {
            console.error('Error getting currently playing:', error.message);
            return null;
        }
    }

    const handlePlayPause = async () => {
        const data = await getCurrentlyPlaying();
        setGlobalCurrentSongId(data?.item?.id);
        setGlobalIsTrackPlaying(!globalIsTrackPlaying);

        if (typeof window !== 'undefined') {
            // Check if audio is already created
            if (!audio) {
                // If not, create a new audio element
                const newAudio = new Audio(data?.preview_url);
                setAudio(newAudio);

                // Set up event listener to update isPlaying state
                newAudio.addEventListener('playing', () => setIsPlaying(true));
                newAudio.addEventListener('pause', () => setIsPlaying(false));
            }

            // Wait for the audio element to be ready before calling play or pause
            await audio.pause(); // Load the audio source

            await audio.play();

            if (globalIsTrackPlaying) {
                // If currently playing, pause the audio
                audio.pause();
            }
        }
    };
    useEffect(() => {
        // Cleanup function to remove event listeners
        return () => {
            if (audio) {
                audio.removeEventListener('playing', () => setIsPlaying(true));
                audio.removeEventListener('pause', () => setIsPlaying(false));
            }
        };
    }, [audio]);
    return (
        <div className='h-24 bg-neutral-800 border-t border-neutral-700 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
            <div className="flex items-center space-x-4">
                {songInfo?.album.images[0].url && <img className='hidden md:inline h-10 w-10' src={songInfo?.album.images[0].url} />}
                <div className="">
                    <p className='text-white text-sm'>{songInfo?.name}</p>
                    <p className='text-neutral-400 text-xs'>{songInfo?.artists[0]?.name}</p>
                </div>
            </div>
            <div className="flex items-center justify-center gap-3">
                <BackwardIcon className="h-8 w-8" />
                {globalIsTrackPlaying ? <PauseCircleIcon onClick={handlePlayPause} className="h-10 w-10" /> : <PlayCircleIcon onClick={handlePlayPause} className="h-10 w-10" />}
                <ForwardIcon className="h-8 w-8" />
            </div>
            <div className="">
            </div>
        </div>
    )
}
