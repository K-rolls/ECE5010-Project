import Router from "next/router";
import CustomButton from "@/components/CustomButton";
import ScaledBackgroundDiv from "@/components/ScaledBackgroundDiv";

const Welcome = () => {
  return (
    <ScaledBackgroundDiv
      childPage={
        <div className="bg-background/90 p-6 rounded-xl border-4 border-mainblue">
          <img src="/SquareLogo.png" className="h-64 w-64" />
          <div className="flex flex-col space-y-6 pt-4 items-center">
            <CustomButton text="Log in" onClick={() => Router.push("/login")} />
            <CustomButton
              text="Sign up"
              onClick={() => Router.push("/signup")}
            />
          </div>
        </div>
      }
    />
  );
};

export default Welcome;
