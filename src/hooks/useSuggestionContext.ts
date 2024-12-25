import { SuggestionsContext } from "@/contexts/suggestionContext";
import { useContext } from "react";

const useSuggestionContext = () => {
  return useContext(SuggestionsContext);
};

export default useSuggestionContext;
