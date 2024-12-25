import type { ReactNode } from "react";
import React from "react";

export interface Heading2Props {
  heading?: ReactNode;
  subHeading?: ReactNode;
  className?: string;
}

const Heading2: React.FC<Heading2Props> = ({
  className = "",
  heading = "Stays in Tokyo",
  subHeading,
}) => {
  return (
    <div className={`mb-12 ${className}`}>
      <h2 className="text-4xl font-semibold">{heading}</h2>
      {subHeading || (
        <span className="mt-3 block text-neutral-500 dark:text-neutral-400">
          233 stays
          <span className="mx-2">·</span>
          Aug 12 - 18
          <span className="mx-2">·</span>2 Guests
        </span>
      )}
    </div>
  );
};

export default Heading2;
