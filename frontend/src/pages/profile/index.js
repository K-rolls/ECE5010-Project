import { Avatar, Image, Text, Link, Spinner } from "@chakra-ui/react";
import Router from "next/router";
import NavBar from "@/components/NavBar";
import { useState, useEffect } from "react";
import CustomButton from "@/components/CustomButton";

const Profile = () => {
  const [reviews, setReviews] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  var user = false;
  function getCookie(name) {
    try {
      const cookies = document.cookie.split("; ");
      for (let i = 0; i < cookies.length; i++) {
        const parts = cookies[i].split("=");
        const cookieName = parts[0];
        const cookieValue = parts[1];
        if (cookieName === name) {
          user = true;
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

  useEffect(() => {
    async function fetchReviews() {
      try {
        var req = {
          token: token,
        };
        console.log(req);

        var response = await fetch("http://localhost:5000/user/getReviewed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req),
        });

        const data = await response.json();
        // console.log(data);
        /**recentDataWithImageAndID,
      albumReviewData,
      artistReviewData,
      sortedReviewed */
        var recentReviews = data.recentDataWithImageAndID;
        var allReviews = data.sortedReviewed;
        var topFourAlbums = data.albumReviewData;
        var topFourArtists = data.artistReviewData;

        console.log(recentReviews);

        setReviews((prevState) => ({
          ...prevState,
          reviews: { topFourAlbums, topFourArtists, recentReviews, allReviews },
        }));
      } catch (error) {
        console.error(error);
        setReviews((prevState) => ({ ...prevState, reviews: null }));
      } finally {
        setIsLoading(false);
      }
    }
    if (token) {
      fetchReviews(token);
    }
  }, [token]);
  console.log(reviews);
  return (
    <div
      className="
        min-h-screen
        max-w-screen
        h-screen
        bg-slate-500
        flex
        items-start
        p-7
        justify-center
overflow-y-auto
        "
    >
      <NavBar />
      <div
        className="flex flex-col space-y-2 justify-center items-center
         "
      >
        <Avatar
          className="flex items-center"
          size="2xl"
          name="Default"
          src="/ProfileDefault.png"
        />
        <div className="flex self-start font-permanent-marker">
          <Text className="flex" color="white" fontSize="xl">
            {" "}
            Favourite Albums{" "}
          </Text>
        </div>
        <div className="bg-background pt-4 pb-4 pr-8 pl-8 rounded-xl border-mainblue border-4 shadow-2xl">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner thickness="4px" speed="0.65s" color="white" size="xl" />
            </div>
          ) : (
            <div className="flex flex-row items-center space-x-8 ">
              {reviews.reviews?.topFourAlbums?.map((review, index) => (
                <div
                  key={index}
                  className="flex border-4 border-white rounded-md "
                >
                  <Link href={`/Album/?id=${review?.content_ID}`}>
                    <Image src={review?.image} className="h-[170px] w-[170px]" />
                  </Link>
                </div>
              ))}
            </div>
          )}{" "}
        </div>
        <div className="flex self-start font-permanent-marker">
          <Text className="flex" color="white" fontSize="xl">
            {" "}
            Favourite Artists{" "}
          </Text>
        </div>
        <div className="bg-background pt-4 pb-4 pr-8 pl-8 rounded-xl border-mainblue border-4 shadow-2xl">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner thickness="4px" speed="0.65s" color="white" size="xl" />
            </div>
          ) : (
            <div className="flex flex-row items-center space-x-8 ">
                {reviews.reviews?.topFourArtists?.map((review, index) => (
                <div
                  key={index}
                    className="flex border-4 border-white rounded-md "
                >
                    <Link href={`/Artist/?id=${review?.content_ID}`}>
                      <Image src={review?.image} className="h-[170px] w-[170px]" />
                  </Link>
                </div>
              ))}
            </div>
          )}{" "}
        </div>

        <div className="flex flex-col justify-center items-center space-y-2">
          {/* <div className="flex self-start font-permanent-marker">
            <Text className="flex" color="white" fontSize="xl">
              {" "}
              Recents{" "}
            </Text>
          </div> */}

          {/* <div className="bg-background pt-4 pb-4 pr-8 pl-8 rounded-xl border-mainblue border-4 shadow-2xl">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  color="white"
                  size="xl"
                />
              </div>
            ) : (
              <div className="flex flex-row items-center space-x-8 ">
                {reviews.reviews?.allReviews?.map((review, index) => (
                  <div
                    key={index}
                    className="h-[175px] w-[175px] border-4 border-white rounded-md "
                  >
                    <Image src={review?.image} />
                  </div>
                ))}
              </div>
            )}{" "}
          </div> */}

          <div className="p-8">
            <button
              onClick={() => Router.push("/Collection")}
              className="
          font-permanent-marker 
          bg-mainblue 
          hover:bg-accentlavender 
          h-12 
          w-48 
          hover:scale-105 
          opacity-100 
          rounded-lg 
          font-extrabold 
          text-background 
          hover:text-white"
            >
              {"View All Reviews"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
