import { Image, Link, Spinner } from "@chakra-ui/react";
import Router from "next/router";
import NavBar from "@/components/NavBar";
import { useState, useEffect } from "react";
import CustomButton from "@/components/CustomButton";

const Home = () => {
  const [reviews, setReviews] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  var data = [];
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
      setIsLoading(true);
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
        var recentReviews = data.recentDataWithImageAndID;
        var allReviews = data.sortedReviewed;
        var topFourAlbums = data.albumReviewData;
        var topFourArtists = data.artistReviewData;

        setReviews((prevState) => ({
          ...prevState,
          reviews: { recentReviews, allReviews },
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
  }, []);

  return (
    <div
      className="
      max-h-screen
      max-w-screen
      h-screen
      bg-slate-500
      flex
      items-start
      p-2
      justify-center
      overflow-y-auto 
        "
    >
      <div className="flex flex-col space-y-2 justify-center items-center">
        <NavBar />
        <div className="flex flex-col justify-center items-center space-y-10 p-2">
          <div className="flex self-center">
            <heading className="text-white text-4xl font-permanent-marker">
              Recently Reviewed
            </heading>
          </div>
          <div className="p-8 bg-background border-4 border-mainblue rounded-xl shadow-2xl max-h-[660px] overflow-y-auto">
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
              <div className="flex-1 grid grid-cols-5 gap-8">
                {reviews.reviews?.allReviews?.map((review, index) => (
                  <div
                    key={index}
                    className="flex border-4 border-white rounded-md shadow-2xl"
                  >
                    <Link href={review?.isAlbum ? `/Album/?id=${review?.content_ID}` : `/Artist/?id=${review?.content_ID}`}>
                      <Image src={review?.image} className="h-[170px] w-[170px]" />
                    </Link>
                  </div>
                ))}
              </div>
            )}

            <style>
              {`
              ::-webkit-scrollbar {
                display: none;
              }
            `}
            </style>
          </div>
          <div className="pb-4">
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
