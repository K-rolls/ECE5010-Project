import { Image, Text, Button } from "@chakra-ui/react";
import { AlbumTile } from "./AlbumTile.js";

function FeedReviewTile({ review, album }) {

    // var albumArt = JSON.parse(album);

    var reviewData = review;
    console.log(review, album);

    // const reviewData = review?.data;
    // const { username, rating, Review } = reviewData?.data;
    const username = "Kirkland"
    const rating = "6"
    const Review = "CUM"

    const handleAlbumClick = (album) => {
        console.log("Album clicked:", album);
    };

    return (
        < div className="border-2 p-3 rounded-md border-accentlavender bg-white w-[350px]" >
            <div className="flex flex-col space-y-2">
                <div className="flex flex-row justify-between overflow-hidden">
                    <AlbumTile
                        // key={index}
                        album={JSON.stringify(album)}
                        onClick={() => handleAlbumClick(album)}
                    >
                        <div className="p-4">
                            {album.image ? (
                                <Image
                                    src={album.image}
                                    alt={album.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    <span className="text-xl">No Image</span>
                                </div>
                            )}
                        </div>
                    </AlbumTile>
                    <Text className=" max-w-[120px] font-permanent-marker">{username}</Text>
                    <Text className=" font-permanent-marker">{rating}★</Text>
                </div>
                <Text>
                    {Review}
                </Text>
            </div>
        </div >

    );

}

export default FeedReviewTile;