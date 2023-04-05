import { IconButton } from "@chakra-ui/react";
import { LinkIcon, SearchIcon } from "@chakra-ui/icons";
import Link from "next/link";

const NavBar = () => {
  return (
    <div className="h-screen w-[75px] absolute left-0 bottom-0 bg-black flex flex-col justify-start items-center flex-grow">
      <Link href="/home">
        <IconButton
          aria-label="Home"
          icon={<img src="/favicon.ico"></img>}
          size="2xl"
          colorScheme="white"
          mt="20px"
          mb="10px"
        />
      </Link>
      <Link href="/profile">
        <IconButton
          aria-label="Profile"
          icon={
            <img
              src="/ProfileDefaultInverted.webp"
              className="h-[48px] w-[48px]"
            ></img>
          }
          colorScheme="white"
          size="lg"
          mt="10px"
          mb="10px"
        />
      </Link>
      <div style={{ flexGrow: 1 }}></div>{" "}
      <Link href="/">
        <IconButton
          aria-label="Profile"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-[48px] w-[48px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
          }
          colorScheme="white"
          size="lg"
          mt="10px"
          mb="20px"
        />
      </Link>
    </div>
  );
};

export default NavBar;
