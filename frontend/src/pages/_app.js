import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";


const MyApp = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
      <Component className="h-full w-full" {...pageProps} />
    </ChakraProvider>
  );
};

export default MyApp;
