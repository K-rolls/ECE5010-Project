import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input
} from "@chakra-ui/react";

const Signup = () => {
  return (
    <div
      className="h-screen w-screen bg-albums bg-contain bg-center flex justify-center items-center"
      background-repeat="no-repeat"
      background-size="cover"
    >
      <div className="bg-background/90 p-6 rounded-xl border-4 border-mainblue">
        <div className="flex flex-col space-y-2 items-center">
          <img src="/SquareLogo.png" className="h-32 w-32"></img>
          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input type="email" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" />
          </FormControl >
          <FormControl isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input type="password" />
          </FormControl>
          <button className=" bg-mainblue h-12 w-32 opacity-100 rounded-lg font-extrabold text-background">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
