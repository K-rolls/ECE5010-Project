import { useState } from "react";
import { Image, Text, Button } from "@chakra-ui/react";
import Router from "next/router";
import Link from "next/link";

function AlbumTile({ album, onClick }) {
  console.log(album);
  const [loading, setLoading] = useState(false);

  try {
    var albumData = JSON.parse(album);
    const { id, name, artists, image, releaseDate } = albumData;
    const localStorageKey = albumData.id;
    const localStorageData = localStorage.getItem(localStorageKey);
    async function handleClick() {
      onClick(id);
      setLoading(true);
      try {
        let data;

        if (localStorageData) {
          data = JSON.parse(localStorageData);
        } else {
          const req = {
            Reviewed: [id],
          };

          const response = await fetch(
            "http://localhost:5000/spotify/getAlbums",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(req),
            }
          );

          data = await response.json();

          localStorage.setItem(localStorageKey, JSON.stringify(data));
        }

        setLoading(false);
        Router.push("/Album");
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

    return (
      <div className="album-tile flex-col p-4 space-y-2 bg-background rounded-xl border-4 border-mainblue">
        <button
          onClick={handleClick}
          disabled={loading}
          className="border-[6px] border-slate-600 rounded-lg"
        >
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
}

export default AlbumTile;