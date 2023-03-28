import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { Formik, Field } from "formik";
import Router from "next/router";
import CustomButton from "@/components/CustomButton";
import ScaledBackgroundDiv from "@/components/ScaledBackgroundDiv";

const Login = () => {
  const loginURL = "http://localhost:5000/user/login";
  const welcomeURL = "http://localhost:5000/user/welcome";
  const toast = useToast();
  const [usernameVal, setUsernameVal] = useState("");
  const [passwordVal, setPasswordVal] = useState("");
  const [showPass, setShowPass] = useState(false);
  const handleShowPassClick = () => setShowPass(!showPass);

  const handleUsernameChange = (event) => {
    setUsernameVal(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPasswordVal(event.target.value);
  };

  async function attemptLogin() {
    console.log("Attempting login");
    console.log(`${usernameVal}, ${passwordVal}`);
    const req = { user: { username: usernameVal, password: passwordVal } };
    //console.log(req);
    try {
      var res = await fetch(loginURL, {
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

  async function welcome(token) {
    console.log(token);
    // const req = { token: token };
    //console.log(req);
    try {
      var res = await fetch(welcomeURL, {
        method: "GET",
        headers: { Authorization: token },
        // body: JSON.stringify(req),
      });
      const data = await res.json();
      // console.log(data);
      return data;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async function handleClick() {
    // console.log("Got here");
    var response = await attemptLogin();
    if (response.message == "user not found!") {
      console.log(response.message);
      toast({
        title: "Error",
        description: "Incorrect username, please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } else if (response.message == "wrong Password!") {
      console.log(response.message);
      toast({
        title: "Error",
        description: "Incorrect password, please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } else {
      console.log(response);
      // localStorage.setItem("token", response.token);
      document.cookie = `token=${response.token}; path=/; secure; SameSite=Strict`;
      const welcomeMessage = await welcome(response.token);
      toast({
        title: `${welcomeMessage.message}`,
        description: "Log in successful.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      Router.push("/home");
    }
  }

  return (
    <ScaledBackgroundDiv
      childPage={
        <div className="bg-background/90 p-6 rounded-xl border-4 border-mainblue">
          <div className="flex flex-col space-y-2 items-center p-6">
            <img src="/SquareLogo.png" className="h-32 w-32"></img>
            <Formik
              initialValues={{
                username: "",
                password: "",
              }}
              onSubmit={() => {
                // console.log("Got here");
                handleClick();
              }}
            >
              {({ handleSubmit, errors, touched }) => (
                <form onSubmit={handleSubmit}>
                  <VStack className="flex items-center" spacing={4}>
                    <FormControl
                      isInvalid={!!errors.username && touched.username}
                    >
                      <FormLabel
                        className=" font-permanent-marker text-mainblue"
                        htmlFor="username"
                      >
                        Username
                      </FormLabel>
                      <div className="bg-white rounded-lg">
                        <Field
                          as={Input}
                          onChange={handleUsernameChange}
                          value={usernameVal}
                          id="username"
                          name="username"
                          type="username"
                          variant="filled"
                          validate={() => {
                            let error;

                            if (usernameVal.length == 0) {
                              error = "Username is required";
                            }

                            return error;
                          }}
                        />
                      </div>
                      <FormErrorMessage>{errors.username}</FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={!!errors.password && touched.password}
                    >
                      <FormLabel
                        className=" font-permanent-marker text-mainblue"
                        htmlFor="password"
                      >
                        Password
                      </FormLabel>
                      <div className="bg-white rounded-lg">
                        <InputGroup>
                          <Field
                            as={Input}
                            onChange={handlePasswordChange}
                            value={passwordVal}
                            id="password"
                            name="password"
                            type={showPass ? "text" : "password"}
                            variant="filled"
                            validate={() => {
                              let error;

                              if (passwordVal.length == 0) {
                                error = "Password is required";
                              }

                              return error;
                            }}
                          />
                          <InputRightElement>
                            <IconButton
                              hover
                              size="lg"
                              aria-label="Show Password"
                              icon={showPass ? <ViewOffIcon /> : <ViewIcon />}
                              backgroundColor="transparent"
                              color="#d299ff"
                              onClick={handleShowPassClick}
                            />
                          </InputRightElement>
                        </InputGroup>
                      </div>

                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    </FormControl>
                    <div className="pt-5">
                      <CustomButton type="submit" text="Log in" />
                    </div>
                  </VStack>
                </form>
              )}
            </Formik>
            <button
              onClick={() => Router.push("/signup")}
              className="pt-5 font-permanent-marker text-mainblue hover:text-accentlavender"
            >
              New user? Sign up!
            </button>
          </div>
        </div>
      }
    />
  );
};

export default Login;
