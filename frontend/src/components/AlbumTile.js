import { Image, Text, Button } from '@chakra-ui/react'
import Router from 'next/router';

function AlbumTile({ album }) {
    try {
        var albumData = JSON.parse(album);
        const { id, name, artists, image, releaseDate } = albumData;
        // const albumID = JSON.stringify(id);
        // console.log(id);
        const req = {
            Reviewed: [
                id
            ]
        };
        // console.log(req);
        async function handleClick() {
            try {
                var response = await fetch("http://localhost:5000/spotify/getAlbums", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(req)
                });
                const data = await response.json();
                // console.log(data);
                return data
            } catch (error) {
                console.error(error);
                return null;
            };
        };

        return (
            <div className="album-tile flex-col p-4 space-y-2 bg-background rounded-xl border-4 border-mainblue" >
                <button onClick={handleClick} className="border-[6px] border-slate-600 rounded-lg">
                    <Image src={image} alt={name} boxSize="175px" objectFit="cover" />
                </button>
                <div className="flex-1 w-[187px]">
                    <div className="text-white font-permanent-marker"> Title: </div>
                    <div className="text-white font-sans">{name}</div>
                </div>
                <div className="flex-1 w-[187px]">
                    <div className="text-white font-permanent-marker"> Artists: </div>
                    <div className="text-white font-sans">{artists}</div>
                </div>
            </div>
        );
    } catch (error) {
        console.error(error);
        // Router.push('/home');
        return null;
    }

};

export default AlbumTile;
