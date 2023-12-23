import React, { useEffect, useState } from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
export const Song = ({
    sno,
    track,
    setGlobalCurrentSongId,
    setGlobalIsTrackPlaying,
    setView,
    setGlobalArtistId
}) => {
    const { data: session } = useSession();
    const [hover, setHover] = useState(false);
    // const [audio, setAudio] = useState(null);

    function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return seconds == 60
            ? minutes + 1 + ":00"
            : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    // async function playSong(track) {
    //     setGlobalCurrentSongId(track.id);
    //     setGlobalIsTrackPlaying(true);
    //     setAudio(new Audio(track.preview_url))
    // }
    // // console.log()

    // useEffect(() => {
    //     if (audio) {
    //         audio.play();
    //     }
    // }, [audio]);

    // const handlePlay = async () => {
    //     try {
    //         await playSong(track);
    //     } catch (e) {
    //         console.log(e.message)
    //     }
    // };

    function selectArtist(artist) {
        setView("artist")
        setGlobalArtistId(artist.id)
    }

    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="grid grid-cols-2 text-neutral-400 text-sm py-4 px-5 hover:bg-white hover:bg-opacity-10 rounded-lg cursor-default"
        >
            <div className="flex items-center space-x-4">
                {hover ? (
                    <PlayIcon className="h-5 w-5 text-white" />
                ) : (
                    <p className="w-5">{sno + 1}</p>
                )}
                {track?.album?.images[0]?.url && <img className="h-10 w-10" src={track.album.images[0].url} />}
                <div className="">
                    <p className="w-36 lg:w-64 truncate text-white text-base">
                        {track.name}
                    </p>
                    <p className="w-36 truncate"></p>
                    <p>
                        {track.artists.map((artist, i) => {
                            return (
                                <>
                                    <span onClick={() => selectArtist(artist)} className="hover:underline">{artist.name}</span>
                                    <span>{i != track.artists.length - 1 ? ", " : null}</span>
                                </>
                            );
                        })}
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-between ml-auto md:ml-0">
                <p className="w-40 truncate hidden md:inline">{track.album.name}</p>
                <p className="">{millisToMinutesAndSeconds(track.duration_ms)}</p>
            </div>
        </div>
    );
};
