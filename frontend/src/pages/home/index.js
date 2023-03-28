import {
  Avatar,
  Image,
  Text,
  Button,
  Stack,
  Input,
  InputGroup,
  InputRightElement,
  Divider,
  IconButton,
  useToast
} from '@chakra-ui/react';

import { SearchIcon } from '@chakra-ui/icons'
import { useState } from 'react';
import Link from 'next/link';
import Router from "next/router";
import NavBar from '../../components/NavBar';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const searchURL = "http://localhost:5000/spotify/albumSearch"
  const toast = useToast();
  try {
    localStorage.setItem("searchTerm", "null");
    localStorage.setItem("currPage", 0);
    localStorage.setItem("searchResults", "null");
    localStorage.setItem("averageVal", 0);
  } catch (error) {
    console.log(error);
  }

  async function makeSearch(searchTerm) {
    const req = {
      "q": searchTerm,
      "decade": "",
      "page": 0
    };
    console.log(req);

    try {
      var res = await fetch(searchURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
      const data = await res.json();
      // console.log(data);
      return data;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async function handleSearch() {
    localStorage.setItem("searchTerm", searchTerm);
    localStorage.setItem("currPage", 0);
    var response = await makeSearch(searchTerm);
    if (searchTerm == "null" || searchTerm == "") {
      toast({
        title: "Error",
        description: "must have a search term",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      })
    } else if (response.error) {
      toast({
        title: "Error",
        description: response.error,
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } else {
      const searchRes = JSON.stringify(response);
      localStorage.setItem("searchResults", searchRes);
      Router.push("/Search");
    }

  };

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
          <div>
            <InputGroup
              size="md"
              width="500px"
              bg="white"
              borderRadius="lg"
              boxShadow="lg"
            >
              <Input placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <InputRightElement>
                <IconButton
                  aria-label="Search"
                  size="sm"
                  icon={<SearchIcon />}
                  backgroundColor="white"
                  color="grey.300"
                  onClick={handleSearch}
                />
              </InputRightElement>
            </InputGroup>
          </div>
          <div className=" bg-background font-permanent-marker text-center rounded-lg text-mainblue p-4 shadow-2xl">
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