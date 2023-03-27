import { Avatar, Image, Text, Button } from '@chakra-ui/react'
import Router from "next/router";
import NavBar from '../../components/NavBar';

const Profile = () => {

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
    ><NavBar />
      <div
        className="flex flex-col space-y-2 justify-center items-center
         ">
        <Avatar className="flex items-center" size='2xl' name='Default' src="/ProfileDefault.png" />
        <div className='flex self-start'>
          <Text className="flex" as='b' color='white' fontSize='xl'> Favourites </Text>
        </div>

        <div
          className="flex flex-row items-center space-x-8"
        >

          <div className="h-[175px] w-[175px]">
            <button>
              <Image src="/TPAB.jpg" />
            </button>
          </div>

          <div className="h-[175px] w-[175px]">
            <button>
              <Image src="/TPAB.jpg" />
            </button>
          </div>
          <div className="h-[175px] w-[175px]">
            <button>
              <Image src="/TPAB.jpg" />
            </button>
          </div>

          <div className="h-[175px] w-[175px]">
            <button>
              <Image src="/TPAB.jpg" />
            </button>
          </div>
        </div>


        <div
          className="flex flex-col justify-center items-center space-y-2">

          <div className='flex self-start'>
            <Text className="flex" as='b' color='white' fontSize='xl'> Recents </Text>
          </div>

          <div
            className="flex flex-row items-center space-x-8"
          >

            <div className="h-[175px] w-[175px]">
              <button>
                <Image src="/TPAB.jpg" />
              </button>
            </div>

            <div className="h-[175px] w-[175px]">
              <button>
                <Image src="/TPAB.jpg" />
              </button>
            </div>
            <div className="h-[175px] w-[175px]">
              <button>
                <Image src="/TPAB.jpg" />
              </button>
            </div>


            <div className="h-[175px] w-[175px]">
              <button>
                <Image src="/TPAB.jpg" />
              </button>
            </div>
          </div>

          <div
            className="flex flex-col justify-center items-center space-y-10 p-8"
          >
            <Button colorScheme='gray' size='lg' >View All</Button>
          </div>




        </div>
      </div>
    </div>
  );
};

export default Profile;