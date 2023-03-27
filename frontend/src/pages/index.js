import link from "next/link";
import Router from "next/router";

const Welcome = () => {
  return (
    <div
      className="
        h-screen
        w-screen
        bg-albums
        bg-contain
        bg-center
        flex 
        justify-center
        items-center
        "
    >
      <div className="bg-background/90 p-6 rounded-xl border-4 border-mainblue">
        <img src="/SquareLogo.png" className="h-64 w-64"></img>
        <div></div>
        <div className="flex flex-col space-y-6 pt-4 items-center">
          <button
            onClick={() => Router.push("/login")}
            className="font-permanent-marker bg-mainblue hover:bg-accentlavender h-12 w-32 hover:scale-105 opacity-100 rounded-lg font-extrabold text-background hover:text-white"
          >
            Login
          </button>
          <button
            onClick={() => Router.push("/signup")}
            className="font-permanent-marker bg-mainblue hover:bg-accentlavender h-12 w-32 hover:scale-105 opacity-100 rounded-lg font-extrabold text-background hover:text-white"
          >
            Sign Up
          </button>
          {/* <button
            onClick={() => Router.push("/Album")}
            className=" bg-mainblue h-12 w-32 opacity-100 rounded-lg font-extrabold text-background"
          >
            Album Test
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
