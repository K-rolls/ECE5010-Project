import { Avatar, Image, Text, Button } from '@chakra-ui/react'
import Router from "next/router";
import NavBar from '../../components/NavBar';

const Home = () => {

    return (
        <div
            className="
        h-screen
        w-screen 
        bg-slate-500
        flex
        items-start
        p-10
        justify-center
        "
        >
            <div
                className="flex flex-col space-y-2 justify-center items-center"
            ><NavBar />
                <div
                    className="flex flex-col justify-center items-center space-y-10 p-8"
                >
                    <Button
                        colorScheme='gray' size='lg' >View All
                    </Button>
                </div>
            </div>
        </div>
    );
};



export default Home;