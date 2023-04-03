import { Image } from "@chakra-ui/react";
import Link from "next/link";

function AlbumTile({ album, onClick }) {
  var albumData = JSON.parse(album);
  const { id, name, artists, image, releaseDate } = albumData;

  return (
    <div className="album-tile flex-col p-4 space-y-2 bg-background rounded-xl border-4 border-mainblue shadow-2xl">
      <Link href={`/Album/?id=${id}`}>
        <button
          onClick={onClick}
          className="border-[4px] border-white rounded-md"
        >
          <Image src={image} alt={name} boxSize="175px" objectFit="cover" />
        </button>
      </Link>

      <div className="flex-1 w-[183px]">
        <div className="text-white font-permanent-marker"> Title: </div>
        <div className="text-white font-sans">{name}</div>
      </div>
      <div className="flex-1 w-[183px]">
        <div className="text-white font-permanent-marker"> Artists: </div>
        <div className="text-white font-sans">{artists}</div>
      </div>
    </div>
  );

}

export default AlbumTile;