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
    console.log(selection);
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
          {/* <RadioGroup value={selection} onChange={setSelection}>
            <div className="flex flex-row space-x-2">
              {" "}
              <RadioGroup.Option value="albums">
                {({ checked }) => (
                  <Box
                    className={
                      checked
                        ? "bg-accentlavender p-2 font-permanent-marker text-white rounded-xl"
                        : "bg-mainblue p-2 font-permanent-marker text-background rounded-xl"
                    }
                  >
                    Albums
                  </Box>
                )}
              </RadioGroup.Option>
              <RadioGroup.Option value="artists">
                {({ checked }) => (
                  <Box
                    className={
                      checked
                        ? "bg-accentlavender p-2 font-permanent-marker text-white rounded-xl"
                        : "bg-mainblue p-2 font-permanent-marker text-background rounded-xl"
                    }
                  >
                    Artists
                  </Box>
                )}
              </RadioGroup.Option>
            </div>
          </RadioGroup> */}
        </div>
      </form>
    </div>
  );
}
