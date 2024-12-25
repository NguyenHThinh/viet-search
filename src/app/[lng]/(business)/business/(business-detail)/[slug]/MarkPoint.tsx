import type { FC } from "react";

import { MapPinIcon } from "@heroicons/react/24/solid";

export interface MarkPointProps {
  className?: string;
  lat: number;
  lng: number;
}

const MarkPoint: FC<MarkPointProps> = ({
  className = "-translate-x-5 -translate-y-5",
}) => {
  return (
    <div className={`nc-MarkPoint relative  ${className}`}>
      <MapPinIcon className="h-6 w-6 text-red-500" />
    </div>
  );
};

export default MarkPoint;
