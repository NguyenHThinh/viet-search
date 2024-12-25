import { BusinessContext } from "@/contexts/searchContext";
import { useContext } from "react";

const useBusinessSearchContext = () => {
  return useContext(BusinessContext);
};

export default useBusinessSearchContext;
