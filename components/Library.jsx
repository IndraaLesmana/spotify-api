import React, { useEffect, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { PlayIcon } from '@heroicons/react/24/solid'
import { signOut, useSession } from 'next-auth/react'


export const Library = ({ setView, setGlobalPlaylistId }) => {
    const { data: session } = useSession()
    const [playlists, setPlaylists] = useState([]);

    function selectPlaylist(playlist) {
        setView("playlist")
        setGlobalPlaylistId(playlist.id)
    }

    useEffect(() => {
        async function f() {
            if (session && session.accessToken) {
                const res = await fetch("https://api.spotify.com/v1/me/playlists", {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                });
                const data = await res.json();
                setPlaylists(data.items);
                // console.log(data.href)
            }
        }
        f();
    }, [session]);

    return (
        <div className='flex-grow h-screen'>
            <header className="text-white sticky top-0 h-20 z-10 text-4xl">
            </header>
            <div onClick={() => signOut()} className="rounded-full absolute z-20 top-5 right-8 flex items-center bg-black bg-opacity-70 text-white space-x-3 opacity-90 hover:opacity-80 cursor-pointer p-1 pr-2">
                <img className='rounded-full w-7 h-7 object-cover' src={session?.user.image} />
                <h2 className='text-sm'>Logout</h2>
                <ChevronDownIcon className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-4 px-8 h-screen overflow-y-scroll">
                <h2 className='text-xl font-bold'>Your Library</h2>
                <div className="flex flex-wrap gap-6 mb-48">
                    {playlists.map((playlist) => {
                        return <div onClick={() => selectPlaylist(playlist)} key={playlist.id} className="cursor-pointer relative group w-56 mb-2 bg-neutral-800 hover:bg-neutral-600 rounded-md p-4">
                            <div className="absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200 shadow-2xl shadow-neutral-900 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-green-500 top-[156px] group-hover:top-[148px] right-6">
                                <PlayIcon className='h-6 w-6 text-black' />
                            </div>
                            <img src={playlist.images[0].url} className='w-48 h-48 mb-4' />
                            <p className='text-base text-white mb-1 w-48 truncate'>{playlist.name}</p>
                            <p className='text-small text-neutral-400 mb-8 w-48 truncate'>{playlist.owner.display_name}</p>
                        </div>
                    })}
                </div>
            </div>
        </div>
    )
}
