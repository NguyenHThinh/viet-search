import {
  BuildingOffice2Icon,
  ChatBubbleBottomCenterIcon,
  ClockIcon,
  LockClosedIcon,
  PhotoIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

function IconUser() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2C14.4501 2 16.4401 3.99 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.15997 14.56C4.73997 16.18 4.73997 18.82 7.15997 20.43C9.90997 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.91997 12.73 7.15997 14.56Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLock() {
  return <LockClosedIcon className="h-6 w-6" />;
}

function IconReview() {
  return <ChatBubbleBottomCenterIcon className="h-6 w-6" />;
}

function IconImage() {
  return <PhotoIcon className="h-6 w-6" />;
}

function IconBuilding() {
  return <BuildingOffice2Icon className="h-6 w-6" />;
}

function IconClock() {
  return <ClockIcon className="h-6 w-6" />;
}

function IconStar() {
  return <StarIcon className="h-6 w-6" />;
}

export {
  IconHeart,
  IconImage,
  IconLock,
  IconReview,
  IconUser,
  IconBuilding,
  IconClock,
  IconStar,
};
