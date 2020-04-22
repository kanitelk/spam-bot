import { DatasetItem, FreqItem } from "./types";
import R from "ramda";

const getWordsFromRow = (text: string): string[] =>
  text
    .split(" ")
    .map((word) => word.toLowerCase().replace(/[^A-Z0-9]+/gi, ""))
    .filter((item) => item.length >= 2);

const countDuplicatesInString = (str: string, word: string): number =>
  getWordsFromRow(str).filter((item) => item === word).length;

const countFreq = (data: DatasetItem[], word: string): FreqItem => ({
  word,
  countSpam: countDuplicatesInString(
    data
      .filter((item) => item.type === "spam")
      .map((item) => item.text)
      .join(" "),
    word
  ),
  countHam: countDuplicatesInString(
    data
      .filter((item) => item.type === "ham")
      .map((item) => item.text)
      .join(" "),
    word
  ),
});

export const train = (data: DatasetItem[]): FreqItem[] =>
  R.uniq(
    R.flatten(data.map((item) => getWordsFromRow(item.text)))
  ).map((word) => countFreq(data, word));
