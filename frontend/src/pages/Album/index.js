import {
  Avatar,
  Image,
  Text,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Box,
  Textarea,
} from "@chakra-ui/react";
import Router from "next/router";
import { useState, useEffect } from "react";
import UserReviewTile from "../../components/UserReviewTile.js";

const Album = () => {
  const [sliderValue, setSliderValue] = useState(0);
  const [reviewValue, setReviewValue] = useState("");
  var AVERAGE;
  // const [albumData, setAlbumData] = useState({});
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
      const value = data.data;

      return value;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function getData() {
    try {
      const albumData = JSON.parse(localStorage.getItem("albumData"));
      console.log(albumData);
      if (!albumData) {
        throw new Error("Album data not found");
      }
      const averageVal = localStorage.getItem("averageVal");
      // AVERAGE = averageVal === null ? 0 : averageVal;
      AVERAGE = averageVal === null ? 0 : parseInt(averageVal);
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user);
      if (!user) {
        throw new Error("User data not found");
      }
      const avg = await getAverage(albumData.id);
      setAlbumData(albumData);
      console.log(albumData);
      return albumData;
    } catch (error) {
      console.error(error);
      // Router.push("/home");
    }
  }

  const [data, setData] = useState();

  useEffect(() => {
    setData(getData());
  }, []);

  console.log(data);
  let handleInputChange = (e) => {
    let inputValue = e.target.value;
    setReviewValue(inputValue);
  };
  
  return (
    <div
      className="
    overflow-auto
    min-h-screen
    min-w-screen
    bg-slate-400
    flex
    justify-center
  "
    >
      <div className="flex flex-col space-y-4 justify-center items-center p-10">
        <div className=" border-[6px] shadow-xl border-white rounded-md ">
          <img src={data.albumData && data.albumData.image} className="h-40 w-40"></img>
        </div>
        <div className="flex flex-col justify-center items-center space-y-0">
          <div>
            <Text
              className="flex font-permanent-marker"
              color="white"
              fontSize="3xl"
            >
              {" "}
              {data.albumData.name}{" "}
            </Text>
          </div>
          <div>
            <Text
              className="flex font-permanent-marker"
              color="white"
              fontSize="xl"
            >
              {" "}
              {data.albumData.artists}{" "}
            </Text>
          </div>
        </div>
        <div className="flex flex-row space-x-2">
          <div className="flex flex-col space-y-1">
            <Text className="font-permanent-marker text-2xl pl-2">Stats</Text>
            <div className="flex bg-background/90 p-6 rounded-xl border-4 border-mainblue">
              <div className=" text-xl flex flex-col space-y-1 items-start">
                <Text className="font-permanent-marker" color="white">
                  Average Rating: {data.avg}★
                </Text>
                <Text className="font-permanent-marker" color="white">
                  Number of Reviews:
                </Text>
                <Text className="font-permanent-marker" color="white">
                  Release Date: {data.albumData.releaseDate}
                </Text>
                <Text className="font-permanent-marker" color="white">
                  Number of Tracks: {data.albumData.numTracks}
                </Text>
              </div>
            </div>
            <Text className="font-permanent-marker text-2xl pl-2">
              Write a review!
            </Text>
            <div className="flex bg-background/90 p-6 rounded-xl border-4 border-mainblue min-h-[400px] min-w-[400px]">
              <div className="flex flex-col grow space-y-2 justify-center items-center p-4">
                <Slider
                  onChange={(val) => setSliderValue(val)}
                  defaultValue={0}
                  min={0}
                  max={10}
                  step={1}
                >
                  <SliderMark
                    value={sliderValue}
                    textAlign="center"
                    bg="#d299ff"
                    color="white"
                    mt="-10"
                    ml="-5"
                    w="10"
                    className="font-permanent-marker rounded-xl"
                  >
                    {sliderValue}
                  </SliderMark>
                  <SliderTrack bg="blue.100">
                    <Box position="relative" right={10} />
                    <SliderFilledTrack bg="#d299ff" />
                  </SliderTrack>
                  <SliderThumb boxSize={4} />
                </Slider>
                <Text className="text-white font-permanent-marker self-start">
                  Review:
                </Text>
                <Textarea
                  value={reviewValue}
                  onChange={handleInputChange}
                  placeholder="Leave a Review!"
                  backgroundColor="white"
                  borderColor="#d299ff"
                  borderWidth={3}
                  focusBorderColor="#d299ff"
                  _hover={false}
                  resize="none"
                  minHeight="180px"
                  maxLength="255"
                />
                <div className="pt-4">
                  <button
                    type="submit"
                    className="font-permanent-marker bg-mainblue hover:bg-accentlavender h-10 w-28 hover:scale-105 opacity-100 rounded-lg font-extrabold text-background hover:text-white"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <Text className="font-permanent-marker self-end text-2xl pr-2">
              User Reviews
            </Text>
            <div className="flex flex-1 bg-background/90 p-6 rounded-xl border-4 border-mainblue max-h-[620px]">
              <div className="flex h-[100%] flex-col space-y-2 overflow-y-auto pr-4">
                <UserReviewTile></UserReviewTile>
                <UserReviewTile></UserReviewTile>
                <UserReviewTile></UserReviewTile>
                <UserReviewTile></UserReviewTile>
                <UserReviewTile></UserReviewTile>
                <UserReviewTile></UserReviewTile>
                <UserReviewTile></UserReviewTile>
                <UserReviewTile></UserReviewTile>
                <UserReviewTile></UserReviewTile>
                <UserReviewTile></UserReviewTile>
                <UserReviewTile></UserReviewTile>
                <UserReviewTile></UserReviewTile>
                <UserReviewTile></UserReviewTile>
                <UserReviewTile></UserReviewTile>
                <UserReviewTile></UserReviewTile>
                <UserReviewTile></UserReviewTile>
                <UserReviewTile></UserReviewTile>
                <UserReviewTile></UserReviewTile>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Album;
