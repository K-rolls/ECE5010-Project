import {
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Box,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import UserReviewTile from "../../components/UserReviewTile.js";
import NavBar from "../../components/NavBar";
import CustomButton from "@/components/CustomButton.js";

const Album = () => {
  const [sliderValue, setSliderValue] = useState(0);
  const [reviewValue, setReviewValue] = useState("");
  const [data, setData] = useState({});
  const [reviews, setReviews] = useState({});
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();

  useEffect(() => {
    async function fetchReviews() {
      try {
        var response = await fetch("http://localhost:5000/spotify/getReviews", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            album_id: id,
          },
        });
        const data = await response.json();
        var numReviews = Object.values(data.data).length;
        var allReviews = data.data;

        setReviews((prevState) => ({
          ...prevState,
          reviews: { numReviews, allReviews },
        }));
      } catch (error) {
        console.error(error);
        setReviews((prevState) => ({ ...prevState, reviews: null }));
      }
    }
    async function getAverage() {
      try {
        var response = await fetch(
          "http://localhost:5000/spotify/averageRating",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              album_id: id,
            },
          }
        );
        const data = await response.json();
        var value = data?.data;
        if (value !== undefined) {
          value = Math.round(value * 100) / 100;
        }
        setData((prevState) => ({ ...prevState, avg: value }));
      } catch (error) {
        console.error(error);
        setData((prevState) => ({ ...prevState, avg: null }));
      }
    }
    async function fetchAlbumData() {
      try {
        var data;
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
        data = data[1];
        setData((prevState) => ({ ...prevState, albumData: data }));
      } catch (error) {
        fetchAlbumData();
        getAverage();
      }
    }
    if (id) {
      fetchAlbumData();
      getAverage();
      fetchReviews();
    }
  }, [id]);

  function getCookie(name) {
    try {
      const cookies = document.cookie.split("; ");
      for (let i = 0; i < cookies.length; i++) {
        const parts = cookies[i].split("=");
        const cookieName = parts[0];
        const cookieValue = parts[1];
        if (cookieName === name) {
          return cookieValue;
        }
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const token = getCookie("token");

  async function makeReview(review, rating) {
    try {
      var req = {
        token: token,
        albumID: id,
        review: review,
        rating: rating,
      };

      const response = await fetch("http://localhost:5000/user/makeReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      });
      const success = await response.json();
      console.log(success);
      return success;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    let review = reviewValue;
    let rating = sliderValue;
    console.log(review);
    console.log(rating);
    var reviewed = await makeReview(review, rating);
    if (reviewed.success) {
      toast({
        title: reviewed.message,
        status: "success",
        set: 5000,
        isClosable: true,
        position: "top",
      });
      setTimeout(() => window.location.reload(), 750);
    } else {
      toast({
        title: reviewed.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    setReviewValue("");
  }

  // Handle input change
  let handleInputChange = (e) => {
    let inputValue = e.target.value;
    setReviewValue(inputValue);
  };

  return (
    <div
      className="
        min-h-screen
        max-w-screen
        h-screen
        bg-slate-500
        flex
        items-start
        p-4
        justify-center
        overflow-y-auto  "
    >
      <NavBar />
      <div className="flex flex-col space-y-2 justify-center items-center">
        <div className=" border-[6px] shadow-xl border-white rounded-md ">
          <img
            src={data.albumData && data.albumData.image}
            className="h-40 w-40"
          ></img>
        </div>
        <div className="flex flex-col justify-center items-center space-y-0">
          <div>
            <Text
              className="flex font-permanent-marker"
              color="white"
              fontSize="3xl"
            >
              {" "}
              {data.albumData?.name}{" "}
            </Text>
          </div>
          <div>
            <Text
              className="flex font-permanent-marker"
              color="white"
              fontSize="xl"
            >
              {" "}
              {data.albumData?.artists}{" "}
            </Text>
          </div>
        </div>
        <div className="flex flex-row space-x-2">
          <div className="flex flex-col space-y-1">
            <Text className="font-permanent-marker text-2xl pl-2">Stats</Text>
            <div className="flex bg-background p-6 rounded-xl border-4 border-mainblue">
              <div className=" text-xl flex flex-col w-full space-y-1 items-start">
                <div className="flex flex-row w-full justify-between items-between">
                  <Text className="font-permanent-marker" color="white">
                    Average Rating :
                  </Text>
                  <Text className="font-permanent-marker" color="white">
                    {data.avg}★
                  </Text>
                </div>
                <div className="flex flex-row w-full justify-between items-between">
                  <Text className="font-permanent-marker" color="white">
                    Number of Reviews :
                  </Text>
                  <Text className="font-permanent-marker" color="white">
                    {reviews.reviews?.numReviews}
                  </Text>
                </div>
                <div className="flex flex-row w-full justify-between items-between">
                  <Text className="font-permanent-marker" color="white">
                    Release Date :
                  </Text>
                  <Text className="font-permanent-marker" color="white">
                    {data.albumData?.releaseDate}
                  </Text>
                </div>
                <div className="flex flex-row w-full justify-between items-between">
                  <Text className="font-permanent-marker" color="white">
                    Number of Tracks :
                  </Text>
                  <Text className="font-permanent-marker" color="white">
                    {data.albumData?.numTracks}
                  </Text>
                </div>
                <div className="flex flex-row w-full justify-between items-between">
                  <Text className="font-permanent-marker" color="white">
                    Album Type :
                  </Text>
                  <Text className="font-permanent-marker" color="white">
                    {data.albumData?.type}
                  </Text>
                </div>
              </div>
            </div>
            <Text className="font-permanent-marker text-2xl pl-2">
              Write a review!
            </Text>
            <form onSubmit={handleSubmit}>
              <div className="flex bg-background p-6 rounded-xl border-4 border-mainblue min-h-[360px] min-w-[400px]">
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
                    minHeight="164px"
                    maxLength="255"
                  />
                  <div className="pt-4 pb-0">
                    <CustomButton text="Submit" type="submit" />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="flex flex-col space-y-1">
            <Text className="font-permanent-marker self-end text-2xl pr-2">
              User Reviews
            </Text>
            <div className="flex flex-1 bg-background p-6 rounded-xl border-4 border-mainblue">
              <div style={{ height: "570px", overflowY: "scroll", scrollbarWidth: "none", borderRadius: "10px", padding: "10px", scrollPadding: "10px" }}>
                {reviews.reviews?.allReviews.map((allReviews) => (
                  <div className="pb-2">
                    <UserReviewTile key={allReviews.id} review={allReviews} />
                  </div>
                ))}
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
      </div>
    </div>
  );
};

export default Album;
