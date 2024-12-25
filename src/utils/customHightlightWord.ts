import { findAll } from "highlight-words-core";

interface Chunk {
  start: number;
  end: number;
}

interface FindChunksParams {
  searchWords: (string | RegExp)[];
  textToHighlight: string;
}

function normalizeString(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// custom match highlight word
function customHighlightWord({
  searchWords,
  textToHighlight,
}: FindChunksParams): Chunk[] {
  const normalizedText = normalizeString(textToHighlight);
  const normalizedSearchWords = searchWords
    .filter((word) => typeof word === "string")
    .map((word) => normalizeString(word as string));

  const chunks: Chunk[] = [];

  normalizedSearchWords.forEach((word) => {
    const regex = new RegExp(word, "gi");
    let match;
    while ((match = regex.exec(normalizedText)) !== null) {
      chunks.push({ start: match.index, end: match.index + match[0].length });

      if (regex.lastIndex === match.index) {
        regex.lastIndex++;
      }
    }
  });

  return chunks;
}

export default customHighlightWord;
