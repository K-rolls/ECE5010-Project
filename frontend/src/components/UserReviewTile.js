import { Text } from "@chakra-ui/react";

const UserReviewTile = () => {
  return (
    <div className="border-2 p-3 rounded-md border-accentlavender bg-white min-w-[250px] max-w-[350px]">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row justify-between overflow-hidden">
          <Text className=" max-w-[120px] font-permanent-marker">AverageScaledUser</Text>
          <Text className=" font-permanent-marker">10★</Text>
        </div>
        <Text>
          Basic Information about the reviewBasic Information about the reviewBasic Information about the reviewBasic Information about the reviewBasic Information about the review
        </Text>
      </div>
    </div>
  );
};

export default UserReviewTile;
