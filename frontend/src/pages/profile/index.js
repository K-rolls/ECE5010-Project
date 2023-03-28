import { Avatar, Image, Text, Button, Link } from "@chakra-ui/react";
import Router from "next/router";
import NavBar from "../../components/NavBar";
import { useState, useEffect } from "react";

const Profile = () => {
  const [reviews, setReviews] = useState({});
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
      // Router.useRouter().push("/");
      return null;
    }
  }

  const token = getCookie("token");
  //console.log(token);

  useEffect(() => {
    async function fetchReviews() {
      // let data.reviews.allReviews.entries = {};
      try {
        var req = {
          "token": token,
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
        console.log(data);
        var recentReviews = data.recents;
        var allReviews = data.reviewed;
        var topFour = data.topRated;
        // topFour = topFour.reverse();
        console.log(recentReviews);

        setReviews((prevState) => ({
          ...prevState,
          reviews: { topFour, recentReviews, allReviews },
        }));
      } catch (error) {
        console.error(error);
        setReviews((prevState) => ({ ...prevState, reviews: null }));
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
        h-screen
        w-screen 
        bg-slate-500
        flex
        items-start
        p-10
        justify-center
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
            Favourites{" "}
          </Text>
        </div>

        <div className="flex flex-row items-center space-x-8 bg-background p-4 rounded-xl border-mainblue border-4 shadow-2xl">
          {reviews.reviews?.topFour?.map((review, index) => (
            <div key={index} className="h-[175px] w-[175px] border-4 border-white rounded-md ">
              <Link href={`/Album/?id=${review?.id}`}>
                <Image src={review?.image} />
              </Link>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-center items-center space-y-2">
          <div className="flex self-start font-permanent-marker">
            <Text className="flex" color="white" fontSize="xl">
              {" "}
              Recents{" "}
            </Text>
          </div>

          <div className="flex flex-row items-center space-x-8 bg-background p-4 rounded-xl border-mainblue border-4 shadow-2xl">
            {reviews.reviews?.recentReviews?.map((review, index) => (
              <div key={index} className="h-[175px] w-[175px] border-4 border-white rounded-md ">
                <Link href={`/Album/?id=${review?.id}`}>
                  <Image src={review?.image} />
                </Link>
              </div>
            ))}
          </div>
          <div className="p-12">
            <button
              onClick={() => Router.push("/Collection")}
              className="font-permanent-marker bg-mainblue hover:bg-accentlavender h-12 w-32 hover:scale-105 opacity-100 rounded-lg font-extrabold text-background hover:text-white shadow-2xl"
            >
              View All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
