import { isEmpty } from "lodash";

export const linkify = (inputText: string) => {
  if (isEmpty(inputText)) return "";

  let replacedText;

  // eslint-disable-next-line
  const replacePattern1 = /(^\w+:|^)\/\//;
  replacedText = inputText.replace(replacePattern1, "");

  // eslint-disable-next-line
  const replacePattern2 = /(^|[^\/])([\S]+(\b|$))/gim;
  replacedText = replacedText.replace(replacePattern2, "https://$2");

  return replacedText;
};
