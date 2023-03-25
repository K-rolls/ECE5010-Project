import { Avatar, Image, Text, Button, Input } from '@chakra-ui/react'
import Router from "next/router";

const Home = () => {

    return (
        <div
            className="
        h-screen
        w-screen 
        bg-slate-400 
        flex
        items-start
        p-10
        justify-center
        "
        >
            <div
                className="flex flex-col space-y-2 justify-center items-center"
            >
                <div
                    className="flex flex-col justify-center items-center space-y-10 p-8"
                >
                    <div
                        className="h-[100px] w-[500px]"
                    >
                        <Input
                            colorScheme='gray' variant='filled'>
                        </Input>
                    </div>
                </div>
            </div>
        </div>




    );
};

export default Home;