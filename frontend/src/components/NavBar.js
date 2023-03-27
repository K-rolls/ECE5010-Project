import { IconButton } from "@chakra-ui/react";
import { LinkIcon, SearchIcon } from "@chakra-ui/icons";
import Link from "next/link";

const NavBar = () => {
    return (
        <div
            style={{
                height: "100vh",
                width: "75px",
                position: "fixed",
                left: "0",
                top: "0",
                backgroundColor: "black",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
            }}
        >
            <Link href="/home">
                <IconButton
                    aria-label="Home"
                    icon={<img src="/favicon.ico"></img>}
                    size="2xl"
                    colorScheme="white"
                    mt="20px"
                    mb="10px"
                />
            </Link>
            <Link href="/profile">
                <IconButton
                    aria-label="Profile"
                    icon={<img src="/ProfileDefaultInverted.webp" className="h-[48px] w-[48px]"></img>}
                    colorScheme="white"
                    size="lg"
                    mt="10px"
                    mb="10px"
                />
            </Link>
        </div>
    );
};

export default NavBar;
