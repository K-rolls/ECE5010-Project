import { Heading, Box, Button, Container } from "@chakra-ui/react";
import Image from "next/image";

const Welcome = () => {
  return (
    <div
      className="h-screen w-screen bg-albums bg-no-repeat bg-cover flex justify-center items-center"
      background-repeat="no-repeat"
      background-size="cover"
    >
      <div className="bg-accentlavender p-6 rounded-xl">
        <div className="flex flex-col space-y-2 items-center">
          <img src="/SquareLogo.png" className="h-64 w-64"></img>
          <button className=" bg-mainblue h-12 w-32 rounded-lg text-white">
            Login
          </button>
          <button className=" bg-mainblue h-12 w-32 rounded-lg text-white">
            Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
