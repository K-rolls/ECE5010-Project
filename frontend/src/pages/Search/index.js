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

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchURL = "http://localhost:5000/spotify/albumSearch";
  const toast = useToast();

  async function makeSearch(searchTerm) {
    const req = {
      q: searchTerm,
      decade: "",
      page: 0,
    };

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

  async function handleSearch(searchTerm) {
    var response = await makeSearch(searchTerm);
    if (searchTerm === "null" || searchTerm === "") {
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
                    "
      >
        <div className="flex flex-col space-y-2 justify-center items-center">
          <div className="flex flex-col justify-center items-center space-y-10 p-8">
            <img src="/SquareLogo.png" className="h-48 w-48"></img>
            <div>
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
                  />
                </InputRightElement>
              </InputGroup>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {searchResJSON.map((album, index) => (
                <AlbumTile key={index} album={JSON.stringify(album)} />
              ))}
            </div>
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
