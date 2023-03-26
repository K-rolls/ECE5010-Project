import { Avatar, Image, Text, Button } from '@chakra-ui/react'
import Router from "next/router";

const Album = () => {

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
                    className="flex flex-col justify-center items-center space-y-0"
                >

                    <div>
                        <img src="TPAB.jpg" className="h-40 w-40"></img>
                    </div>
                    <div>
                        <Text className="flex font-permanent-marker" color='white' fontSize='3xl'> To Pimp A Butterfly </Text>
                    </div>
                    <div>
                        <Text className="flex font-permanent-marker" color='white' fontSize='xl'> Kendrick Lamar </Text>
                    </div>


                </div>
            </div>
        </div >




    );
};


export default Album;