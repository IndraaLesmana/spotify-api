import React, { useEffect, useState } from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
export const Song = ({
    sno,
    track,
    setGlobalCurrentSongId,
    setGlobalIsTrackPlaying,
}) => {
    const { data: session } = useSession();
    const [hover, setHover] = useState(false);

    async function playSong(track) {
        setGlobalCurrentSongId(track.id);
        setGlobalIsTrackPlaying(true);
        if (session && session.accessToken) {
            const res = await fetch("https://api.spotify.com/v1/me/player/play", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
                body: JSON.stringify({
                    uris: [track.uri],
                }),
            });
            console.log("on play", res.status);
            // <audio src="https://p.scdn.co/mp3-preview/3555c6200a0ab12b967d3df1e17197155aa16ec0?cid=fb9263d085694fe4a5a37c9caff3a69c"></audio>
        }
    }

    function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return seconds == 60
            ? minutes + 1 + ":00"
            : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    const [audio] = useState(
        new Audio(
            "https://p.scdn.co/mp3-preview/3555c6200a0ab12b967d3df1e17197155aa16ec0?cid=fb9263d085694fe4a5a37c9caff3a69c"
        )
    );
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // Mengatur sumber audio saat komponen dimuat
        audio.src =
            "https://p.scdn.co/mp3-preview/3555c6200a0ab12b967d3df1e17197155aa16ec0?cid=fb9263d085694fe4a5a37c9caff3a69c";

        // Mengatur event listener untuk menangani perubahan status pemutaran
        audio.addEventListener("ended", () => {
            setIsPlaying(false);
        });

        // Membersihkan event listener saat komponen di-unmount
        return () => {
            audio.removeEventListener("ended", () => {
                setIsPlaying(false);
            });
        };
    }, []);

    const handlePlay = async () => {
        await playSong(track);

        // Memeriksa apakah audio sedang dimainkan atau dihentikan
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }

        // Mengupdate keadaan pemutaran
        setIsPlaying(!isPlaying);
    };
    console.log(handlePlay);
    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="grid grid-cols-2 text-neutral-400 text-sm py-4 px-5 hover:bg-white hover:bg-opacity-10 rounded-lg cursor-default"
        >
            <div className="flex items-center space-x-4">
                {" "}
                {hover ? (
                    <PlayIcon onClick={handlePlay} className="h-5 w-5 text-white" />
                ) : (
                    <p className="w-5"> {sno + 1} </p>
                )}{" "}
                <img className="h-10 w-10" src={track.album.images[0].url} />{" "}
                <div className="">
                    <p className="w-36 lg:w-64 truncate text-white text-base">
                        {" "}
                        {track.name}{" "}
                    </p>{" "}
                    <p className="w-36 truncate"> </p>{" "}
                    <p>
                        {" "}
                        {track.artists.map((artist, i) => {
                            return (
                                <>
                                    <span className="hover:underline"> {artist.name} </span>{" "}
                                    <span> {i != track.artists.length - 1 ? ", " : null} </span>{" "}
                                </>
                            );
                        })}{" "}
                    </p>{" "}
                </div>{" "}
            </div>{" "}
            <div className="flex items-center justify-between ml-auto md:ml-0">
                <p className="w-40 truncate hidden md:inline"> {track.album.name} </p>{" "}
                <p className=""> {millisToMinutesAndSeconds(track.duration_ms)} </p>{" "}
            </div>{" "}
        </div>
    );
};




////////////////////////////////

import React, { useEffect, useState } from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
export const Song = ({
    sno,
    track,
    setGlobalCurrentSongId,
    setGlobalIsTrackPlaying,
}) => {
    const { data: session } = useSession();
    const [hover, setHover] = useState(false);

    async function playSong(track) {
        setGlobalCurrentSongId(track.id);
        setGlobalIsTrackPlaying(true);
        if (session && session.accessToken) {
            const res = await fetch("https://api.spotify.com/v1/me/player/play", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
                body: JSON.stringify({
                    uris: [track.uri],
                }),
            });
            // console.log(res);
            // <audio src="https://p.scdn.co/mp3-preview/3555c6200a0ab12b967d3df1e17197155aa16ec0?cid=fb9263d085694fe4a5a37c9caff3a69c"></audio>
        }
    }
    function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return seconds == 60
            ? minutes + 1 + ":00"
            : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    const [audio] = useState(
        new Audio(
            "https://p.scdn.co/mp3-preview/3555c6200a0ab12b967d3df1e17197155aa16ec0?cid=fb9263d085694fe4a5a37c9caff3a69c"
        )
    );
    // const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        audio.src =
            "https://p.scdn.co/mp3-preview/3555c6200a0ab12b967d3df1e17197155aa16ec0?cid=fb9263d085694fe4a5a37c9caff3a69c";

        // audio.addEventListener("ended", () => {
        //     setIsPlaying(false);
        // });

        // return () => {
        //     audio.removeEventListener("ended", () => {
        //         setIsPlaying(false);
        //     });
        // };
    }, []);

    const handlePlay = async () => {
        await playSong(track);

        console.log(track)
        // if (isPlaying) {
        //     audio.pause();
        // } else {
        audio.play();
        // }

        // setIsPlaying(!isPlaying);
    };
    // console.log(handlePlay);
    return (
        <div
            onClick={handlePlay}
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
                <img className="h-10 w-10" src={track.album.images[0].url} />
                <div className="">
                    <p className="w-36 lg:w-64 truncate text-white text-base">
                        {track.name}
                    </p>
                    <p className="w-36 truncate"></p>
                    <p>
                        {track.artists.map((artist, i) => {
                            return (
                                <>
                                    <span className="hover:underline">{artist.name}</span>
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
