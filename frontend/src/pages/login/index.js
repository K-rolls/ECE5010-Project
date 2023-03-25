import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  VStack,
} from "@chakra-ui/react";
//TODO: Fix this shit
import { useState } from "react";
import { Formik, Field } from "formik";

const Login = () => {
  const loginURL = "http://localhost:5000/login";

  const [usernameVal, setUsernameVal] = useState("");
  const [passwordVal, setPasswordVal] = useState("");

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
    var res = await fetch(loginURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    }).then((res) => {
      console.log(res.json());
      return res;
    });
  }

  async function handleClick(username, password) {
    console.log("Got here");
    await attemptLogin();
  }

  // const validate = values => {
  //   const errors = {};
  //   if (!values.username) {
  //     errors.username = 'Required';
  //   } else if (values.firstName.length > 15) {
  //     errors.username = 'Must be 15 characters or less';
  //   }

  //   if (!values.lastName) {
  //     errors.lastName = 'Required';
  //   } else if (values.lastName.length > 20) {
  //     errors.lastName = 'Must be 20 characters or less';
  //   }

  //   if (!values.email) {
  //     errors.email = 'Required';
  //   } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
  //     errors.email = 'Invalid email address';
  //   }

  //   return errors;
  // };

  // const validateUsername = (username) => {
  //   let errors;
  //   if (!username) {
  //     error = "Username is required";
  //   }
  //   //TODO: put in error for nonexistant username once user auth is implemented
  //   return error;
  // }

  // const validatePassword = (password) => {
  //   let error;
  //   if (!password) {
  //     error = "Password is required";
  //   }
  //   //TODO: put in error for incorrect password once user auth is implemented
  //   return error;
  // }

  return (
    <div
      className="h-screen w-screen bg-albums bg-contain bg-center flex justify-center items-center"
      background-repeat="no-repeat"
      background-size="cover"
    >
      <div className="bg-background/90 p-6 rounded-xl border-4 border-mainblue">
        <div className="flex flex-col space-y-2 items-center">
          <img src="/SquareLogo.png" className="h-32 w-32"></img>
          <Formik
            initialValues={{
              username: "",
              password: "",
            }}
            onSubmit={() => {
              console.log("Got here");
              handleClick();
            }}
          >
            {({ handleSubmit, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <VStack className="flex items-center" spacing={4}>
                  <FormControl
                    isInvalid={!!errors.username && touched.username}
                  >
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <Field
                      as={Input}
                      onChange={handleUsernameChange}
                      value={usernameVal}
                      id="username"
                      name="username"
                      type="username"
                      variant="filled"
                      validate={(value) => {
                        let error;

                        if (usernameVal.length == 0) {
                          error = "Username is required";
                        }

                        return error;
                      }}
                    />
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={!!errors.password && touched.password}
                  >
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Field
                      as={Input}
                      onChange={handlePasswordChange}
                      value={passwordVal}
                      id="password"
                      name="password"
                      type="password"
                      variant="filled"
                      validate={(value) => {
                        let error;

                        if (passwordVal.length == 0) {
                          error = "Password is required";
                        }

                        return error;
                      }}
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  <button
                    type="submit"
                    className=" bg-mainblue h-12 w-32 opacity-100 rounded-lg font-extrabold text-background"
                  >
                    Login
                  </button>
                </VStack>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
