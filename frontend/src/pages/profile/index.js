import { Avatar, Image, Text, Link, Spinner } from "@chakra-ui/react";
import { Dialog } from "@headlessui/react";
import Router from "next/router";
import NavBar from "@/components/NavBar";
import { useState, useEffect } from "react";
import CustomButton from "@/components/CustomButton";
import jwt from "jsonwebtoken";
import axios from "axios";

const Profile = () => {
  const [reviews, setReviews] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(["/uploads/default-profile-picture.png"]);

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

  const [selectedFile, setSelectedFile] = useState(null);
  const [userId, setUserId] = useState("");

  const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const decodedToken = jwt.decode(token);
    const userID = decodedToken ? decodedToken.User_ID : null;
    event.preventDefault();
    const formData = new FormData();
    formData.append('profilePic', selectedFile);
    formData.append('User_ID', userID);

    try {
      const response = await axios.post('http://localhost:5000/user/setProfilePic', formData);
      setProfilePic(response.data.user.profilePicture);
      setIsOpen(false)
    } catch (error) {
      console.log(error);
    }
  };

  async function getProfilePic() {
    const decodedToken = jwt.decode(token);
    const userID = decodedToken ? decodedToken.User_ID : null;
    try {
      const response = await fetch(`http://localhost:5000/user/getProfilePic/?User_ID=${userID}`);
      const data = await response.json();
      return "/uploads" + data.profilePicture;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function fetchReviews() {
      try {
        var req = {
          token: token,
        };

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
          reviews: { topFourAlbums, topFourArtists, recentReviews, allReviews },
        }));
      } catch (error) {
        console.error(error);
        setReviews((prevState) => ({ ...prevState, reviews: null }));
      } finally {
        setIsLoading(false);
        const profilePicPath = await getProfilePic();
        setProfilePic(profilePicPath);
      }
    }
    if (token) {
      fetchReviews(token);
    }
  }, [token]);
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
          src={profilePic}
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
        <div className="bg-background pt-4 pb-4 pr-8 pl-8 rounded-xl border-accentlavender border-4 shadow-2xl">
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
          <div className="flex flex-row space-x-2 p-8">
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
            <button
              onClick={() => setIsOpen(true)}
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
              {"Edit Profile"}
            </button>
          </div>
        </div>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div
            className="fixed inset-0 bg-black/70 blur-6xl"
            aria-hidden="true"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="text-white min-w-[500px] min-h-[200px] bg-black border-accentlavender border-[7px] p-8 overflow-auto text-justify rounded-2xl">
              <Dialog.Title>
                <div className="text-3xl flex flex-col font-permanent-marker">
                  Change your profile picture?
                </div>
              </Dialog.Title>
              <Dialog.Description>
                <div className="flex space-y-2 text-xl max-w-[550px] pt-4">
                  <form className="flex flex-col space-y-8 justify-center items-center" onSubmit={handleSubmit}>
                    <label>
                      Profile Picture:
                      <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleFileInputChange} className="pl-2" />
                    </label>
                    <button type="submit" className="
                        font-permanent-marker 
                        bg-mainblue 
                        hover:bg-accentlavender 
                        h-18 
                        w-48 
                        hover:scale-105 
                        opacity-100 
                        rounded-lg 
                        font-extrabold
                        text-lg
                        text-background 
                        hover:text-white">
                      Upload Profile Picture
                    </button>
                  </form></div>
              </Dialog.Description>

            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Profile;
