import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
  Stack,
  Box,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useRouter } from "next/router";

export default function SearchBar({ selection }) {
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();
  const router = useRouter();
  var isAlbum;
  var searchURL;

  async function makeSearch(searchTerm) {
    if (selection == "albums") {
      isAlbum = '1';
      searchURL = "http://localhost:5000/spotify/albumSearch";
    } else {
      isAlbum = '0';
      console.log("Searching for an artist");
      searchURL = "http://localhost:5000/spotify/artistSearch";
    }

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
      router.push(`/Search/?isAlbum=${isAlbum}`);
    }
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <div
          className="flex flex-col justify-center items-center space-y-2"
          style={{ cursor: "pointer" }}
        >
          {" "}
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
                aria-label="Search"
                size="sm"
                icon={<SearchIcon />}
                backgroundColor="white"
                color="grey.300"
                type="submit"
              />
            </InputRightElement>
          </InputGroup>
        </div>
      </form>
    </div>
  );
}
