import {
    Image, Text, Button, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";
import Link from "next/link";

function FeedReviewTile({ album, review, rating, username }) {
    const handleAlbumClick = (album) => {
        console.log("Album clicked:", album);
    };

    return (
        <div className="album-tile flex-col p-4 space-y-2 bg-background rounded-xl border-4 snap-y min-w-[300px] max-h-[250px] border-mainblue">
            <div className="flex flex-row space-x-4">
                <Link href={`/Album/?id=${album.id}`}>
                    <button
                        // disabled={loading}
                        className="border-[4px] border-white rounded-md"
                    >
                        <Image src={album.image} alt={album.name} boxSize="167px" objectFit="cover" />
                    </button>
                </Link>
                <div className="flex flex-col space-y-2 text-white max-w-[500px]">
                    <div className="flex flex-row overflow-hidden space-x-2">
                        <img src="/favicon-32x32.png" alt="profile picture" className="w-8 h-8 rounded-full" />
                        <Text className="font-permanent-marker">{username}</Text>
                        <Text className="flex font-permanent-marker justify-end">{rating}★</Text>
                    </div>
                    {review && (
                        <div className="border-2 p-3 rounded-md border-accentlavender text-black bg-white w-[200px]">
                            <Text>{review}</Text>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}

export default FeedReviewTile;
