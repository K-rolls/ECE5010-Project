import { Image, Text, Button } from "@chakra-ui/react";
import Router from "next/router";
import Link from "next/link";

function AlbumTile({ album }) {
  try {
    var albumData = JSON.parse(album);
    const { id, name, artists, image, releaseDate } = albumData;
    // const albumID = JSON.stringify(id);
    // console.log(id);
    const req = {
      Reviewed: [id],
    };
    async function getAverage(album_id) {
      try {
        var response = await fetch(
          "http://localhost:5000/spotify/averageRating",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              album_id: album_id,
            },
          }
        );
        const data = await response.json();
        const value = JSON.stringify(data);

        return value;
      } catch (error) {
        console.error(error);
        return null;
      }
    }

    async function handleClick() {
      try {
        var response = await fetch("http://localhost:5000/spotify/getAlbums", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req),
        });
        const data = await response.json();
        const value = JSON.stringify(data);
        // console.log(value);
        await localStorage.setItem("albumData", value);
        const avg = await getAverage(id);
        // const avg
        console.log(avg);
        await localStorage.setItem("avg", avg);
        
        return await data;
      } catch (error) {
        console.error(error);
        return null;
      }
    }

    return (
      <div className="album-tile flex-col p-4 space-y-2 bg-background rounded-xl border-4 border-mainblue">
        <Link href="/Album">
          <button
            onClick={handleClick}
            className="border-[6px] border-slate-600 rounded-lg"
          >
            <Image src={image} alt={name} boxSize="175px" objectFit="cover" />
          </button>
        </Link>

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
}

export default AlbumTile;
