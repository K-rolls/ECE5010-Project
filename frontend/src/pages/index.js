import { Heading, Box, Button, Container } from "@chakra-ui/react";
import Image from "next/image";

const Welcome = () => {
  return (
    <div
      className="h-screen w-screen bg-albums bg-no-repeat bg-cover flex justify-center items-center"
      background-repeat="no-repeat"
      background-size="cover"
    >
      <div className="bg-background opacity-90 p-6 rounded-xl border-4 border-mainblue">
        <div className="flex flex-col space-y-2 items-center">
          <img src="/SquareLogo.png" className="h-64 w-64"></img>
          <button className=" bg-mainblue h-12 w-32 rounded-lg font-extrabold text-background">
            Login
          </button>
          <button className=" bg-mainblue h-12 w-32 rounded-lg font-extrabold text-background">
            Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
