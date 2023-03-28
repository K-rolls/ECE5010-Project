import { Avatar, Image, Text, Button } from "@chakra-ui/react";
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
        var response = await fetch("http://localhost:5000/user/getReviewed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            token: token,
          },
        });

        // var response = await fetch("http://localhost:5000/spotify/getReviews", {
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/json",
        //     "album_id": token,
        //   },
        // });

        console.log("Hi");
        const data = await response.json();
        console.log(data);
        var topFourReviews = data.topFour;
        var allReviews = data.reviewed;

        console.log(topFourReviews);

        setReviews((prevState) => ({
          ...prevState,
          reviews: { topFourReviews, allReviews },
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
        <div className="flex self-start">
          <Text className="flex" as="b" color="white" fontSize="xl">
            {" "}
            Favourites{" "}
          </Text>
        </div>

        <div className="flex flex-row items-center space-x-8">
          <div className="h-[175px] w-[175px]">
            <button>
              <Image src="/TPAB.jpg" />
            </button>
          </div>

          <div className="h-[175px] w-[175px]">
            <button>
              <Image src="/TPAB.jpg" />
            </button>
          </div>
          <div className="h-[175px] w-[175px]">
            <button>
              <Image src="/TPAB.jpg" />
            </button>
          </div>

          <div className="h-[175px] w-[175px]">
            <button>
              <Image src="/TPAB.jpg" />
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center space-y-2">
          <div className="flex self-start">
            <Text className="flex" as="b" color="white" fontSize="xl">
              {" "}
              Recents{" "}
            </Text>
          </div>

          <div className="flex flex-row items-center space-x-8">
            {reviews.reviews?.topFourReviews.map((review) => (
              <div className="h-[175px] w-[175px]">
                <button>
                  <Image src={review?.image} />
                </button>
              </div>
            ))}

            {/* <div className="h-[175px] w-[175px]">
              <button>
                <Image src="/TPAB.jpg" />
              </button>
            </div>
            <div className="h-[175px] w-[175px]">
              <button>
                <Image src="/TPAB.jpg" />
              </button>
            </div>


            <div className="h-[175px] w-[175px]">
              <button>
                <Image src="/TPAB.jpg" />
              </button>
            </div> */}
          </div>

          <div className="flex flex-col justify-center items-center space-y-10 p-8">
            <Button colorScheme="gray" size="lg">
              View All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
