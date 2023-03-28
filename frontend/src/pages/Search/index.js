import {
  Avatar,
  Image,
  Text,
  Button,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import Router from "next/router";
import { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import AlbumTile from "../../components/AlbumTile.js";
import NavBar from '../../components/NavBar';
import Link from 'next/link';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchURL = "http://localhost:5000/spotify/albumSearch";
  const toast = useToast();
  var currPage = 0;

  async function makeSearch(searchTerm, page = 0) {
    const req = {
      q: searchTerm,
      decade: "",
      page: page,
    };
    console.log(req);
    try {
      var res = await fetch(searchURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
      const data = await res.json();
      return data;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async function handleSearch(searchTerm, page = 0) {
    if (page === 0) {
      localStorage.setItem("currPage", 0);
    } else {
      var currPage = parseInt(localStorage.getItem("currPage")) || 0;
      page = currPage + 1;
      localStorage.setItem("currPage", page);
    }
    if (!searchTerm) {
      searchTerm = localStorage.getItem("searchTerm") || "";
    } else {
      localStorage.setItem("searchTerm", searchTerm);
    }
    var response = await makeSearch(searchTerm, page);
    if (!searchTerm) {
      toast({
        title: "Error",
        description: "must have a search term",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } else if (response.error) {
      toast({
        title: "Error",
        description: response.error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      const searchRes = JSON.stringify(response);
      localStorage.setItem("searchResults", searchRes);
      Router.push("/Search");
    }
  }


  try {
    var searchResults = localStorage.getItem("searchResults");
    var searchResJSON = JSON.parse(searchResults);

    if (!searchResJSON) {
      Router.push("/home");
      return null;
    }

    return (
      <div
        className="
                    h-screen
                    w-screen 
                    bg-slate-400 
                    flex
                    items-start
                    p-10
                    justify-center
                    overflow-y-scroll
                    "
      ><NavBar />
        <div className="flex flex-col space-y-2 justify-center items-center">

          <div className="flex flex-col justify-center items-center space-y-10 p-8">
            <Link href="/home">
              <Image src="/SquareLogo.png" className="h-48 w-48" />
            </Link>
            <div>
              <form onSubmit={(e) => {
                e.preventDefault()
                handleSearch();
              }}>
              <InputGroup
                size="md"
                width="500px"
                bg="white"
                borderRadius="lg"
                boxShadow="lg"
              >
                <Input
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Search albums"
                    size="sm"
                    icon={<SearchIcon />}
                    backgroundColor="white"
                    color="grey.300"
                    onClick={() => handleSearch(searchTerm)}
                      type="submit"
                  />
                </InputRightElement>
              </InputGroup>
              </form>
            </div>
            <div className="flex-1 grid grid-cols-5 gap-4">
              {searchResJSON.map((album, index) => (
                <AlbumTile key={index} album={JSON.stringify(album)} />
              ))}
            </div>
            <Button
              aria-label="Next page"

              backgroundColor="white"
              color="grey.300"
              onClick={() => handleSearch(localStorage.getItem(searchTerm), 1)}
            >
              Next Page
            </Button>
          </div>
        </div>

      </div >
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default Search;
