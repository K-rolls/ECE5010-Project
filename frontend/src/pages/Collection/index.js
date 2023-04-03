import { Image, Link } from "@chakra-ui/react";
import Router from "next/router";
import NavBar from "../../components/NavBar";
import { useState, useEffect } from "react";
import CustomButton from "@/components/CustomButton";

const Home = () => {
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
        console.log(data);
        var recentReviews = data.recents;
        var allReviews = data.reviewed;
        var topFour = data.topRated;
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
      <div className="flex flex-col space-y-2 justify-center items-center">
        <NavBar />
        <div className="flex flex-col justify-center items-center space-y-10 p-8">
          <div className="flex self-center">
            <heading className="text-white text-4xl font-permanent-marker">
              Recently Reviewed
            </heading>
          </div>
          <div className="p-8 bg-background border-4 border-mainblue rounded-xl shadow-2xl max-h-[665px] overflow-y-auto">
            <div className="flex-1 grid grid-cols-5 gap-8">
              {reviews.reviews?.allReviews?.map((review, index) => (
                <div
                  key={index}
                  className="h-[175px] w-[175px] border-4 border-white rounded-md shadow-2xl"
                >
                  <Link href={`/Album/?id=${review?.id}`}>
                    <Image src={review?.image} />
                  </Link>
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
          <div className="p-8">
            <CustomButton
              text="Review More"
              onClick={() => Router.push("/home")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
