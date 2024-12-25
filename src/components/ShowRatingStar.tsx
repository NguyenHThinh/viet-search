import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as EmptyStar } from "@heroicons/react/24/outline";
import { FC } from "react";

interface ShowRatingStarProps {
  rating: number;
  size?: string;
}

const ShowRatingStar: FC<ShowRatingStarProps> = ({
  rating,
  size = "h-5 w-5",
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const halfStar = () => {
    return (
      <div className={`relative ${size}`}>
        <EmptyStar className={`absolute ${size} text-yellow-500`} />
        <div
          className={`absolute ${size} overflow-hidden`}
          style={{ width: "50%" }}
        >
          <StarIcon className={`absolute ${size} text-yellow-500`} />
        </div>
      </div>
    );
  };

  return (
    <div className="flex text-yellow-500">
      {[...Array(fullStars)].map((_, index) => (
        <StarIcon key={index} className={size} />
      ))}
      {hasHalfStar && <div className="">{halfStar()}</div>}
      {[...Array(emptyStars)].map((_, index) => (
        <EmptyStar key={index} className={size} />
      ))}
    </div>
  );
};

export default ShowRatingStar;
