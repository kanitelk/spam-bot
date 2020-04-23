import * as fs from "fs";
import path from "path";

import { readTrainFromFile } from "./";
import { predict } from "./predict";
import { DatasetItem } from "./types";

export const testAccuracy = (count: number = 500): void => {
  let cases: DatasetItem[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data.json")).toString()
  );

  cases = cases.slice(5000, cases.length);
  let right = 0;

  const fArr = readTrainFromFile();

  cases.forEach((item, index) => {
    if (index % 100 === 0) console.log(`${index}/${cases.length} predicted`);
    let res = predict(fArr, item.text);
    let textRes;
    res.ham >= res.spam ? (textRes = "ham") : (textRes = "spam");
    if (textRes === item.type) right++;
  });

  console.log(`Accuracy: ${Math.round((right / cases.length) * 10000) / 100}%`);
};
