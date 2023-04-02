import {
  Text,
  Stack,
  Divider,
} from '@chakra-ui/react';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import SearchBar from '../../components/SearchBar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import FeedReviewTile from '../../components/FeedReviewTile';
import CustomButton from '../../components/CustomButton';

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [len, setLen] = useState(1);

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
        const response = await axios.post("http://localhost:5000/user/getAllReviews", {
          "num": len,
        });
        if (response.data.success === false) {
          setLen(1);
        }
        if (typeof response.data === 'object') {
          setReviews(response.data.reviews);
        } else if (Array.isArray(response.data)) {
          setReviews(response.data.reviews);
        }
        setIsLoading(false);

      } catch (error) {
        console.error(error);
        setLen(1);
      }
    }
    fetchReviews();
  }, [len]);


  function handleClick() {
    console.log("clicked: " + len);
    if (len < 0) {
      setLen(1);
    } else {
      setLen(len + 1);
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
      <div
        className="flex flex-col justify-center items-center p-10 "
      >
        <NavBar />
        <div
          className="flex flex-col justify-center items-center space-y-5"
        >
          <img src="/SquareLogo.png" className="h-48 w-48"></img>

          <SearchBar />

          <div style={{ height: "calc(100vh - 100px)", overflowY: "scroll", scrollbarWidth: "none", borderRadius: "10px", padding: "10px" }}>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <Stack spacing={10}>
                <div>
                    {reviews?.map(({ album, Review, rating, username, index }) => (
                    <FeedReviewTile
                      key={index}
                      album={album}
                      review={Review}
                      rating={rating}
                      username={username}
                    />
                  ))}
                </div>
              </Stack>
            )}
          </div>

          <style>
            {`
              ::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>

          <CustomButton
            text="More Reviews"
            onClick={handleClick}
          />
        </div>
      </div>
    </div >
  );
};

export default Home;
