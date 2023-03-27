import { Image, Text, Button } from '@chakra-ui/react'
import Router from 'next/router';

function AlbumTile({ album }) {
    try {
        var albumData = JSON.parse(album);
        const { id, name, artists, image, releaseDate } = albumData;
        // const albumID = JSON.stringify(id);
        console.log(id);
        const req = {
            Reviewed: [
                id
            ]
        };
        console.log(req);
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
                console.log(data);
                return data
            } catch (error) {
                console.error(error);
                return null;
            };
        };

        return (
            <div className="album-tile">
                <button onClick={handleClick}>
                    <Image
                        src={image}
                        alt={name}
                        boxSize='175px'
                        objectFit='cover'
                    />
                </button>
                <Text>{name}</Text>
            </div>
        );
    } catch (error) {
        console.error(error);
        // Router.push('/home');
        return null;
    }

};

export default AlbumTile;
