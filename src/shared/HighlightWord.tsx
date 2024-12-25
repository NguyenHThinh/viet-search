import customHighlightWord from "@/utils/customHightlightWord";
import React from "react";
import Highlighter from "react-highlight-words";

interface HighlightProps {
  text: string;
  highlight: string;
  className?: string;
}

const HighlightWord: React.FC<HighlightProps> = ({
  text,
  highlight,
  className,
}) => {
  return (
    <Highlighter
      highlightClassName="highlight_word"
      searchWords={[highlight]}
      autoEscape={true}
      textToHighlight={text}
      findChunks={customHighlightWord}
      className={className}
    />
  );
};

export default HighlightWord;
