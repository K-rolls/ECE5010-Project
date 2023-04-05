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
import ScaledBackgroundDiv from "@/components/ScaledBackgroundDiv";
import CustomButton from "@/components/CustomButton";

const Signup = () => {
  const signupURL = "http://localhost:5000/user/signup";
  const [usernameVal, setUsernameVal] = useState("");
  const [passwordVal, setPasswordVal] = useState("");
  const [confirmPasswordVal, setConfirmPasswordVal] = useState("");
  const [showPass, setShowPass] = useState(false);
  const handleShowPassClick = () => setShowPass(!showPass);
  const [showConfirm, setShowConfirm] = useState(false);
  const handleShowConfirmClick = () => setShowConfirm(!showConfirm);
  const toast = useToast();

  const handleUsernameChange = (event) => {
    setUsernameVal(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPasswordVal(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPasswordVal(event.target.value);
  };

  async function attemptSignup() {
    const req = { user: { username: usernameVal, password: passwordVal } };
    try {
      var res = await fetch(signupURL, {
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

  async function handleClick() {
    var response = await attemptSignup();
    if (response.error) {
      toast({
        title: "Error",
        description: "Username already exists",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } else {
      toast({
        title: "Success",
        description: "Account created! Please login",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      Router.push("/login");
    }
  }

  return (
    <ScaledBackgroundDiv childPage={
      <div className="bg-background/90 p-6 rounded-xl border-4 border-mainblue">
        <div className="flex flex-col space-y-2 items-center p-6">
          <img src="/SquareLogo.png" className="h-36 w-36"></img>
          <Formik
            initialValues={{
              username: "",
              password: "",
              confirmPassword: "",
            }}
            onSubmit={() => {
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
                        className="focus:bg-current"
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
                      className="font-permanent-marker"
                      htmlFor="password"
                      textColor="#94C1D2"
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
                  <FormControl
                    isInvalid={
                      !!errors.confirmPassword && touched.confirmPassword
                    }
                  >
                    <FormLabel
                      className="font-permanent-marker"
                      htmlFor="confirmPassword"
                      textColor="#94C1D2"
                    >
                      Confirm Password
                    </FormLabel>
                    <div className="bg-white rounded-lg">
                      <InputGroup>
                        <Field
                          as={Input}
                          onChange={handleConfirmPasswordChange}
                          value={confirmPasswordVal}
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirm ? "text" : "password"}
                          variant="filled"
                          validate={() => {
                            let error;

                            if (passwordVal !== confirmPasswordVal) {
                              error = "Passwords must match";
                            }

                            return error;
                          }}
                        />
                        <InputRightElement>
                          <IconButton
                            size="lg"
                            aria-label="Show Password"
                            icon={showConfirm ? <ViewOffIcon /> : <ViewIcon />}
                            backgroundColor="transparent"
                            color="#d299ff"
                            onClick={handleShowConfirmClick}
                          />
                        </InputRightElement>
                      </InputGroup>
                    </div>
                    <FormErrorMessage>
                      {errors.confirmPassword}
                    </FormErrorMessage>
                  </FormControl>
                  <div className="pt-5">
                    <CustomButton text="Sign up" type="submit"/>
                  </div>
                </VStack>
              </form>
            )}
          </Formik>
          <button
            onClick={() => Router.push("/login")}
            className="pt-5 font-permanent-marker text-mainblue hover:text-accentlavender"
          >
            Already have an account? Log in!
          </button>
        </div>
      </div>
    } />
  );
};

export default Signup;
