import type { FC } from "react";
import React from "react";

import MainNav from "./MainNav";
import MainNav1 from "./MainNav1";
import MainNav2 from "./MainNav2";

export interface HeaderProps {
  navType?: "MainNav1" | "MainNav2" | "MainNav";
  className?: string;
  lng: string;
}

const Header: FC<HeaderProps> = ({
  navType = "MainNav1",
  className = "",
  lng,
}) => {
  const renderNav = () => {
    switch (navType) {
      case "MainNav1":
        return <MainNav1 lng={lng} />;
      case "MainNav2":
        return <MainNav2 lng={lng} />;
      default:
        return <MainNav lng={lng} />;
    }
  };

  return (
    <div
      className={`nc-Header nc-header-bg sticky inset-x-0 top-0 z-40 w-full ${className}`}
    >
      {renderNav()}
    </div>
  );
};

export default Header;
