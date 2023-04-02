import {
  Spinner,
  Stack,
} from '@chakra-ui/react';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import SearchBar from '../../components/SearchBar';
import { useEffect, useState, useRef } from 'react';
import FeedReviewTile from '../../components/FeedReviewTile';
import CustomButton from '../../components/CustomButton';

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [len, setLen] = useState(1);
  const scrollableDivRef = useRef(null);

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
      scrollableDivRef.current.scrollTo(0, 0);
    } else {
      setLen(len + 1);
      scrollableDivRef.current.scrollTo(0, 0);
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
          <div className='shadow-bottom'>
            <div style={{ height: "calc(100vh - 100px)", overflowY: "scroll", scrollbarWidth: "none", borderRadius: "10px", padding: "10px", flexGrow: 1 }} ref={scrollableDivRef}>
            {isLoading ? (
                <Spinner
                  thickness='4px'
                  speed='0.65s'
                  emptyColor='gray.200'
                  color='blue.500'
                  size='xl'
                />
              ) : (
                <div>
                    {reviews?.map(({ album, Review, rating, username, index }) => (
                    <div className='pb-2'>

                    <FeedReviewTile
                      key={index}
                      album={album}
                      review={Review}
                      rating={rating}
                      username={username}
                    />
                    </div>

                  ))}
                </div>

            )}
              <div className="flex flex-col justify-center items-center space-y-5">
                <CustomButton
                  text="More Reviews"
                  onClick={handleClick}
                />
              </div>
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
    </div >
  );
};

export default Home;
