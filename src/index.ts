import * as fs from "fs";
import path from "path";

import { train } from "./train";
import { DatasetItem, FreqItem } from "./types";

const getData = (): DatasetItem[] => {
  let data = fs.readFileSync(path.join(__dirname, "data.json"));
  let arr = JSON.parse(data.toString());
  arr.length = 5000;
  return arr;
};

export const writeTrainToFile = (f_name: string = "freq.json") =>
  fs.writeFileSync(
    path.join(__dirname, f_name),
    JSON.stringify(train(getData()), null, 2)
  );

export const readTrainFromFile = (f_name: string = "freq.json"): FreqItem[] =>
  JSON.parse(fs.readFileSync(path.join(__dirname, f_name)).toString());
