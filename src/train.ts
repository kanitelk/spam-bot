import { DatasetItem, FreqItem } from "./types";
import R from "ramda";
import * as fs from "fs";
import path from "path";

export const getDatasetData = (): DatasetItem[] => {
  let data = fs.readFileSync(path.join(__dirname, "data.json"));
  let arr = JSON.parse(data.toString());
  arr.length = 5000;
  return arr;
};

export const readTrainFromFile = (f_name: string = "freq.json"): FreqItem[] =>
  JSON.parse(fs.readFileSync(path.join(__dirname, f_name)).toString());

export const writeTrainToFile = (f_name: string = "freq.json") =>
  fs.writeFileSync(
    path.join(__dirname, f_name),
    JSON.stringify(train(getDatasetData()), null, 2)
  );

export const getWordsFromRow = (text: string): string[] =>
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
