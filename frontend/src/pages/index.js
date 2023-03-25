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
        <div className="flex flex-col space-y-2 items-center">
          <img src="/SquareLogo.png" className="h-64 w-64"></img>
          <div></div>
          <button
            onClick={() => Router.push("/login")}
            className=" bg-mainblue h-12 w-32 opacity-100 rounded-lg font-extrabold text-background"
          >
            Login
          </button>
          <button
            onClick={() => Router.push("/signup")}
            className=" bg-mainblue h-12 w-32 opacity-100 rounded-lg font-extrabold text-background"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
