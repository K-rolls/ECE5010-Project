import { Text } from "@chakra-ui/react";

function UserReviewTile({ review }) {

  const reviewData = review;
  const { id, username, rating, Review } = reviewData;

  return (
    <div className="border-2 p-3 rounded-md border-accentlavender bg-white w-[350px]">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row justify-between overflow-hidden">
          <Text className=" max-w-[120px] font-permanent-marker">{username}</Text>
          <Text className=" font-permanent-marker">{rating}★</Text>
        </div>
        <Text>
          {Review}
        </Text>
      </div>
    </div>
  );
};

export default UserReviewTile;
