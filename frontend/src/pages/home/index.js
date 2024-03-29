import { Spinner, Text, Box } from "@chakra-ui/react";
import { RadioGroup } from "@headlessui/react";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import NavBar from "@/components/NavBar";
import SearchBar from "@/components/SearchBar";
import FeedAlbumReviewTile from "@/components/FeedAlbumReviewTile";
import FeedArtistReviewTile from "@/components/FeedArtistReviewTile";
import CustomButton from "@/components/CustomButton";
import ScaledLogo from "@/components/ScaledLogo";

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [len, setLen] = useState(1);
  const scrollableDivRef = useRef(null);
  const [selection, setSelection] = useState("albums");

  try {
    localStorage.setItem("searchTerm", "null");
    localStorage.setItem("currPage", 0);
    localStorage.setItem("searchResults", "null");
    localStorage.setItem("averageVal", 0);
  } catch (error) {
    console.log(error);
  }

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await axios.post(
          "http://localhost:5000/user/getAllReviews",
          {
            num: len,
          }
        );
        if (response.data.success === false) {
          setLen(1);
          setIsLoading(true);
        } else if (typeof response.data === "object") {
          setReviews(response.data);
          setIsLoading(false);
        } else if (Array.isArray(response.data)) {
          setReviews(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLen(1);
        setIsLoading(true);
      }
    }
    fetchReviews();
  }, [len]);

  function handleClick() {
    if (len < 0) {
      setLen(1);
      scrollableDivRef.current.scrollTo(0, 0);
      setIsLoading(true);
    } else {
      setLen(len + 1);
      scrollableDivRef.current.scrollTo(0, 0);
      setIsLoading(true);
    }
  }

  return (
    <div
      className="
        min-h-screen
        max-w-screen
        h-screen
        bg-slate-500
        flex
        items-start
        justify-center
        overflow-y-auto 
        "
    >
      <NavBar />
      <div className="flex flex-col space-y-2 justify-center items-center p-8">
        <div className="flex flex-col justify-center items-center space-y-5">
          <ScaledLogo />
          <SearchBar selection={selection} />
          <RadioGroup value={selection} onChange={setSelection}>
            <div className="flex flex-row space-x-2">
              <div className="cursor-pointer">
                <RadioGroup.Option value="albums">
                  {({ checked }) => (
                    <Box
                      className={
                        checked
                          ? "bg-accentlavender p-2 font-permanent-marker text-white rounded-xl"
                          : "bg-mainblue p-2 font-permanent-marker text-background rounded-xl"
                      }
                    >
                      Albums
                    </Box>
                  )}
                </RadioGroup.Option>
              </div>
              <div className="cursor-pointer">
                <RadioGroup.Option value="artists">
                  {({ checked }) => (
                    <Box
                      className={
                        checked
                          ? "bg-accentlavender p-2 font-permanent-marker text-white rounded-xl"
                          : "bg-mainblue p-2 font-permanent-marker text-background rounded-xl"
                      }
                    >
                      Artists
                    </Box>
                  )}
                </RadioGroup.Option>
              </div>
            </div>
          </RadioGroup>
          <div className="font-permanent-marker text-white text-3xl ">
            <Text>Recently Reviewed</Text>
          </div>
          <div
            className="rounded-lg ps-4 pb-4 flex-grow"
            ref={scrollableDivRef}
            style={{ maxHeight: "calc(100vh - 100px)" }}
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-full pb-4">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="white"
                  color="#0B4981"
                  size="xl"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                  {reviews
                    .sort((a, b) => a.index - b.index)
                    .map(({ isAlbum, artist, album, review, rating, username, index }) => (
                      <div className="pb-0" key={index}>
                        {isAlbum ? (
                          <FeedAlbumReviewTile
                            album={album}
                            review={review}
                            rating={rating}
                            username={username}
                            style={{ cursor: "pointer" }}
                          />
                      ) : (
                        <FeedArtistReviewTile
                          artist={artist}
                          review={review}
                          rating={rating}
                          username={username}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </div>
                  ))}
              </div>
            )} 
            <div className="flex flex-col justify-center items-center space-y-5 pt-4 pb-4">
              <CustomButton text="More Reviews" onClick={handleClick} />
            </div>
          </div>
          <style>
            {`
              ::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
        </div>
      </div>
    </div>
  );
};

export default Home;
