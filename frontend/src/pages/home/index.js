import {
  Text,
  Stack,
  Divider,
} from '@chakra-ui/react';

import NavBar from '../../components/NavBar';
import SearchBar from '../../components/SearchBar';
import FeedReviewTile from '../../components/FeedReviewTile';
const Home = () => {
  try {
    localStorage.setItem("searchTerm", "null");
    localStorage.setItem("currPage", 0);
    localStorage.setItem("searchResults", "null");
    localStorage.setItem("averageVal", 0);
  } catch (error) {
    console.log(error);
  }

  const reviewData = {
    "success": true,
    "data":
    {
      "id": 52,
      "User_ID": "3e02de17-d690-3e96-952a-2e834b3306e8",
      "Album_ID": "7CGhx630DIjdJqaBDVKc5j",
      "Review": "",
      "rating": 10,
      "username": "Keegan"
    }

  };

  const albumData =
  {
    "name": "Master of Puppets (Remastered Deluxe Box Set)",
    "artists": "Metallica",
    "id": "7CGhx630DIjdJqaBDVKc5j",
    "image": "https://i.scdn.co/image/ab67616d0000b273cad4832cb7b5844343278daa",
    "releaseDate": "1986-03-03",
    "numTracks": 137,
    "type": "album"
  };

  const album = JSON.stringify(albumData);
  const review = JSON.stringify(reviewData);


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
      <div
        className="flex flex-col justify-center items-center p-10 "
      >
        <NavBar />
        <div
          className="flex flex-col justify-center items-center space-y-5"
        >
          <img src="/SquareLogo.png" className="h-48 w-48"></img>
          <SearchBar />
          {/* <div className=" bg-background font-permanent-marker text-center rounded-lg text-white p-4 shadow-2xl">
            <Stack spacing={1} >
              <Text fontSize='4xl' paddingBottom={2}> Welcome to Scaled! </Text>
              <Divider orientation='horizontal' />
              <Text fontSize='lg' paddingTop={2}> Use the search bar above to search for an album </Text>
              <Text fontSize='lg'> Or use the side bar to navigate to your profile </Text>
            </Stack>
          </div> */}
          <FeedReviewTile album={JSON.parse(album)} review={JSON.parse(review)} >
          </FeedReviewTile> 
        </div>
      </div>
    </div >
  );
};

export default Home;