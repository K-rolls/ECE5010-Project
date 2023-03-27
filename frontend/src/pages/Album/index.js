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
  Link
} from "@chakra-ui/react";
import { useRouter, Router } from "next/router";
import { useState, useEffect } from "react";
import UserReviewTile from "../../components/UserReviewTile.js";
import NavBar from '../../components/NavBar';


const Album = () => {
  const [sliderValue, setSliderValue] = useState(0);
  const [reviewValue, setReviewValue] = useState("");
  const [data, setData] = useState({});
  const [reviews, setReviews] = useState({});
  const router = useRouter();
  const { id } = router.query;
  const nextId = id;
  // Access the id parameter from the query string
  // const token = localStorage.getItem("token");
  // console.log(token);


  useEffect(() => {
    async function fetchReviews() {
      // let data.reviews.allReviews.entries = {};

      try {
        var response = await fetch(
          "http://localhost:5000/spotify/getReviews",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              album_id: id,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        var numReviews = Object.values(data.data).length;
        var allReviews = data.data;

        console.log(allReviews);
        setReviews(prevState => ({ ...prevState, reviews: { numReviews, allReviews } }));
      } catch (error) {
        console.error(error);
        setReviews(prevState => ({ ...prevState, reviews: null }));
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
        const value = data.data;

        setData(prevState => ({ ...prevState, avg: value }));
      } catch (error) {
        console.error(error);
        setData(prevState => ({ ...prevState, avg: null }));
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
        // console.log(data);
        setData(prevState => ({ ...prevState, albumData: data }));
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

  // {
  //   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IktpcmtsYW5kIiwiVXNlcl9JRCI6IjE4NTMxNmIxLTc1NTYtMzIxNS1hZDdhLTUxMDM2YjZjZWZiMyIsImlhdCI6MTY3OTk1NDAzMH0.V8RtAKHi4vzv0UDhThfA6C27e_ooaugw7fEieCmN3vY",
  //     "albumID": "7CGhx630DIjdJqaBDVKc5j",
  //       "review": "I love this album i am definitely Kirkland",
  //         "rating": 10
  // }
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
      // Router.useRouter().push("/");
      return null;
    }
  }

  const token = getCookie("token");
  console.log(token);

  async function makeReview(review, rating) {
    try {
      console.log(review);
      console.log(rating);
      var req = {
        "token": token,
        "albumID": id,
        "review": review,
        "rating": rating,
      };

      const response = await fetch(
        "http://localhost:5000/user/makeReview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req),
        }
      );
      const success = await response.json().then(window.location.reload());
      console.log(success);
    }
    catch (error) {
      console.error(error);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    let review = reviewValue;
    let rating = sliderValue;
    console.log(review);
    console.log(rating);
    makeReview(review, rating);

  }

  // Handle input change
  let handleInputChange = (e) => {
    // console.log(data)
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
        <NavBar />
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
            <div className="flex bg-background/90 p-6 rounded-xl border-4 border-mainblue">
              <div className=" text-xl flex flex-col space-y-1 items-start">
                <Text className="font-permanent-marker" color="white">
                  Average Rating: {data.avg}★
                </Text>
                <Text className="font-permanent-marker" color="white">
                  Number of Reviews: {reviews.reviews?.numReviews}
                </Text>
                <Text className="font-permanent-marker" color="white">
                  Release Date: {data.albumData?.releaseDate}
                </Text>
                <Text className="font-permanent-marker" color="white">
                  Number of Tracks: {data.albumData?.numTracks}
                </Text>
              </div>
            </div>
            <Text className="font-permanent-marker text-2xl pl-2">
              Write a review!
            </Text>
            <form onSubmit={handleSubmit}>
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
                    {/* <Link href={`/Album/?id=${nextId}`}> */}
                    <button
                      type="submit"
                      className="font-permanent-marker bg-mainblue hover:bg-accentlavender h-10 w-28 hover:scale-105 opacity-100 rounded-lg font-extrabold text-background hover:text-white"
                    >
                      Submit
                    </button>
                    {/* </Link> */}
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="flex flex-col space-y-1">
            <Text className="font-permanent-marker self-end text-2xl pr-2">
              User Reviews
            </Text>
            <div className="flex flex-1 bg-background/90 p-6 rounded-xl border-4 border-mainblue max-h-[620px]">
              <div className="flex h-[100%] flex-col space-y-3 overflow-y-auto p-1 justify-start items-center">
                {/* {data.reviews.allReviews.map((allReviews) => (
                  <UserReviewTile key={allReviews.id} review={allReviews} />
                ))} */}
                {reviews.reviews?.allReviews.map((allReviews) => (
                  <UserReviewTile key={allReviews.id} review={allReviews} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Album;
