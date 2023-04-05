import { Image, useToast, Box } from "@chakra-ui/react";
import { useState } from "react";
import Router from "next/router";
import Link from "next/link";
import { RadioGroup } from "@headlessui/react";
import NavBar from "@/components/NavBar";
import SearchBar from "@/components/SearchBar";
import AlbumTile from "@/components/AlbumTile";
import ScaledLogo from "@/components/ScaledLogo";
import CustomButton from "@/components/CustomButton";
import { useRouter } from "next/router";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  var searchURL;
  const toast = useToast();
  var currPage = 0;
  const [selection, setSelection] = useState("albums");
  var isAlbumQuery;
  const router = useRouter();
  const { isAlbum } = router.query;

  async function makeSearch(searchTerm, page = 0, selection) {
    if (selection == "albums") {
      isAlbumQuery = "1";
      searchURL = "http://localhost:5000/spotify/albumSearch";
    } else {
      isAlbumQuery = "0";
      console.log("Searching for an artist");
      searchURL = "http://localhost:5000/spotify/artistSearch";
    }
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

  async function handleSearch(searchTerm, page = 0, typeSelection) {
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
    var response = await makeSearch(searchTerm, page, typeSelection);
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
      Router.push(`/Search/?isAlbum=${isAlbumQuery}`);
    }
  }

  const handleAlbumClick = (album) => {
    console.log("Album clicked:", album);
  };

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
        <NavBar />
        <div className="flex flex-col space-y-2 justify-center items-center p-8">
          <div className="flex flex-col justify-center items-center space-y-5">
            <Link href="/home">
              <ScaledLogo />
            </Link>
            <SearchBar selection={selection} />
            <RadioGroup value={selection} onChange={setSelection}>
              <div className="flex flex-row space-x-2">
                {" "}
                <div className="cursor-pointer">
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
                </div>
                <div className="cursor-pointer">
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
              </div>
            </RadioGroup>
            <div className="flex-1 grid grid-cols-5 gap-4">
              {searchResJSON.map((album, index) => (
                <AlbumTile
                  isAlbum={isAlbum == "1" ? true : false}
                  key={index}
                  album={JSON.stringify(album)}
                  onClick={() => handleAlbumClick(album)}
                >
                  <div className="p-4">
                    {album.image ? (
                      <Image
                        src={album.image}
                        alt={album.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <span className="text-xl">No Image</span>
                      </div>
                    )}
                  </div>
                </AlbumTile>
              ))}
            </div>
            {selection == "albums" && (
              <CustomButton
                text="Next Page"
                onClick={() =>
                  handleSearch(localStorage.getItem(searchTerm), 1, selection)
                }
              />
            )}
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
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default Search;
