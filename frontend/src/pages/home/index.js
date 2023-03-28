import {
  Text,
  Stack,
  Divider,
} from '@chakra-ui/react';

import NavBar from '../../components/NavBar';
import SearchBar from '../../components/SearchBar';
const Home = () => {
  try {
    localStorage.setItem("searchTerm", "null");
    localStorage.setItem("currPage", 0);
    localStorage.setItem("searchResults", "null");
    localStorage.setItem("averageVal", 0);
  } catch (error) {
    console.log(error);
  }

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
      <div
        className="flex flex-col justify-center items-center p-10 "
      >
        <NavBar />
        <div
          className="flex flex-col justify-center items-center space-y-5"
        >
          <img src="/SquareLogo.png" className="h-48 w-48"></img>
          <SearchBar />
          <div className=" bg-background font-permanent-marker text-center rounded-lg text-white p-4 shadow-2xl">
            <Stack spacing={1} >
              <Text fontSize='4xl' paddingBottom={2}> Welcome to Scaled! </Text>
              <Divider orientation='horizontal' />
              <Text fontSize='lg' paddingTop={2}> Use the search bar above to search for an album </Text>
              <Text fontSize='lg'> Or use the side bar to navigate to your profile </Text>
            </Stack>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Home;