import {
  Image,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Divider,
  Avatar,
} from "@chakra-ui/react";
import { Dialog } from "@headlessui/react";
import Link from "next/link";
import { useState } from "react";
import CustomButton from "./CustomButton";

function FeedReviewTile({ album, review, rating, username }) {
  const handleAlbumClick = (album) => {
    //console.log("Album clicked:", album);
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="album-tile flex-col p-4 space-y-2 bg-background rounded-xl border-4 snap-y min-w-[300px] max-h-[250px] border-mainblue">
      <div className="flex flex-row space-x-4">
        <Link href={`/Album/?id=${album.id}`}>
          <button
            className="border-[4px] border-white rounded-md"
          >
            <Image
              src={album.image}
              alt={album.name}
              boxSize="167px"
              objectFit="cover"
            />
          </button>
        </Link>
        <div className="flex flex-col space-y-4 text-white text-xl max-w-[500px] justify-center items-center">
          <div className="font-permanent-marker text-white text-2xl">
            Album
          </div>
          <div className="flex flex-row overflow-hidden space-x-2">
            <img
              src="/favicon-32x32.png"
              alt="profile picture"
              className="w-8 h-8 rounded-full"
            />
            <div className="font-permanent-marker text-clip w-[95px] whitespace-nowrap overflow-hidden">
              {username}
            </div>
            <Text className="flex font-permanent-marker justify-end">
              {rating}★
            </Text>
          </div>
          <div className="font-permanent-marker text-white text-base">
            {review && (
              <CustomButton text="Read Review" onClick={() => setIsOpen(true)} />
            )}
          </div>
        </div>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div
            className="fixed inset-0 bg-black/70 blur-6xl"
            aria-hidden="true"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="text-white min-w-[500px] min-h-[200px] bg-black border-accentlavender border-[7px] p-8 overflow-auto text-justify rounded-2xl">
              <Dialog.Title>
                <div className="text-3xl flex flex-col font-permanent-marker">
                  <div className="flex flex-row justify-center">
                    <div className="font-permanent-marker">{album.name}</div>
                  </div>
                  <Link href={`/Album/?id=${album.id}`}>
                    <div className="text-2xl sfont-permanent-marker flex justify-center">
                      By: {album.artists}
                    </div>
                  </Link>
                  <div className="py-4">
                    <Divider orientation="horizontal" />
                  </div>
                </div>
              </Dialog.Title>
              <Dialog.Description>
                <Text className="flex text-xl max-w-[550px]">{review}</Text>
              </Dialog.Description>
              <Dialog.Title>
                <div className="text-3xl font-permanent-marker flex flex-col space-y-2 text-white pt-6">
                  <div className="flex flex-row justify-between overflow-hidden">
                    <Text className="pt-1 flex font-permanent-marker">
                      {rating}★
                    </Text>
                    <div className="flex flex-row space-x-4">
                      <Text className="pt-1 font-permanent-marker">
                        {username}
                      </Text>
                      <Avatar
                        size="md"
                        src="/favicon-32x32.png"
                        alt="profile picture"
                      />
                    </div>
                  </div>
                </div>
              </Dialog.Title>
              {/* ... */}
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
}

export default FeedReviewTile;
