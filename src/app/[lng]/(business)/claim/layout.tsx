import React, { ReactNode } from "react";

const DetailtLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="ListingDetailPage">
      <div className="ListingDetailPage__content container">{children}</div>
    </div>
  );
};

export default DetailtLayout;
