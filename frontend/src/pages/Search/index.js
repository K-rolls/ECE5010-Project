import {
  Image,
  Button,
  useToast
} from "@chakra-ui/react";
import Router from "next/router";
import { useState } from "react";
import AlbumTile from "../../components/AlbumTile.js";
import NavBar from '../../components/NavBar';
import SearchBar from '../../components/SearchBar';

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

  const handleAlbumClick = (album) => {
    console.log("Album clicked:", album);
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
                    bg-slate-500
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
            <SearchBar />
            <div className="flex-1 grid grid-cols-5 gap-4">
              {searchResJSON.map((album, index) => (
                <AlbumTile key={index} album={JSON.stringify(album)} onClick={() => handleAlbumClick(album)}>
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

            <button
              className="font-permanent-marker bg-mainblue hover:bg-accentlavender h-12 w-32 hover:scale-105 opacity-100 rounded-lg font-extrabold text-background hover:text-white shadow-2xl"
              onClick={() => handleSearch(localStorage.getItem(searchTerm), 1)}
            >
              Next Page
            </button>
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
