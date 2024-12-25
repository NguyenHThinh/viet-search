import React from "react";

import { NAVIGATION_DEMO } from "@/data/navigation";

import NavigationItem from "./NavigationItem";

function Navigation() {
  return (
    <ul className="nc-Navigation relative hidden lg:flex lg:flex-wrap lg:space-x-1">
      {NAVIGATION_DEMO.map((item) => (
        <NavigationItem key={item.id} menuItem={item} />
      ))}
    </ul>
  );
}

export default Navigation;
