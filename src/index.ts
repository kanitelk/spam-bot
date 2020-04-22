import * as fs from "fs";
import path from "path";
import R from "ramda";

import { DatasetItem, FreqItem } from "./types";
import { train } from "./train";

const getData = (): DatasetItem[] => {
  let data = fs.readFileSync(path.join(__dirname, "data.json"));
  let arr = JSON.parse(data.toString());
  arr.length = 200;
  return arr;
};

const getWordsFromRow = (text: string): string[] => {
  let words = text.split(" ");
  return words
    .map((word) => word.toLowerCase().replace(/[^A-Z0-9]+/gi, ""))
    .filter((item) => item.length >= 2);
};

const countDuplicates = (str: string, word: string): number => {
  const words = getWordsFromRow(str);
  return words.filter((item) => item === word).length;
};

const countFreq = (data: DatasetItem[], word: string): FreqItem => {
  let countSpam = 0;
  let countHam = 0;

  for (let i = 0; i < data.length; i++) {
    data[i].type == "spam"
      ? (countSpam += countDuplicates(data[i].text, word))
      : (countHam += countDuplicates(data[i].text, word));
  }
  return {
    word,
    countSpam,
    countHam,
  };
};

const predict = (freqArr: FreqItem[], text: string) => {
  let total_spam_words = 0,
    total_ham_words = 0,
    total_words_count = 0;
  for (let i = 0; i < freqArr.length; i++) {
    total_ham_words += freqArr[i].countHam;
    total_spam_words += freqArr[i].countSpam;
    total_words_count += freqArr[i].countHam + freqArr[i].countSpam;
  }

  // console.log(
  //   `Total: ${total_words_count}, Ham: ${total_ham_words}, Spam: ${total_spam_words}`
  // );

  const words = getWordsFromRow(text);

  const wordP_arr: Array<{ word: string; p_spam: number; p_ham: number }> = [];

  words.forEach((word) => {
    let res = freqArr.find((i) => i.word === word);
    if (!res) return;
    if (res.countHam === 0) res.countHam = 1;
    if (res.countSpam === 0) res.countSpam = 1;

    wordP_arr.push({
      word,
      p_spam: res.countSpam / total_spam_words,
      p_ham: res.countHam / total_ham_words,
    });
  });

  let spam = 0,
    ham = 0;

  for (let i = 0; i < wordP_arr.length; i++) {
    spam += Math.log2(wordP_arr[i].p_spam);
    ham += Math.log2(wordP_arr[i].p_ham);
  }

  console.log(`Spam: ${spam} Ham: ${ham}`);

  if (spam >= ham) {
    return "spam";
  } else {
    return "ham";
  }
};

const start = async () => {
  const data = getData();

  console.log(train(data).length)

  // fs.writeFileSync(
  //   path.join(__dirname, "freq.json"),
  //   JSON.stringify(freqArr, null, 2)
  // );
};

start();

// const fArr = JSON.parse(
//   fs.readFileSync(path.join(__dirname, "freq.json")).toString()
// );

// const test = () => {
//   let cases: DatasetItem[] = JSON.parse(
//     fs.readFileSync(path.join(__dirname, "data.json")).toString()
//   )
//   console.log(cases.length);

//   cases = cases.slice(5000, cases.length)
//   let right = 0;
//   cases.forEach((item, index) => {
//     if (index % 100 === 0) console.log(`${index}/${cases.length} predicted`);
//     let res = predict(fArr, item.text);
//     if (res === item.type) right++;
//   });

//   console.log(`Accuracy: ${Math.round(right/cases.length * 10000) / 100}%`);

// }

// start()
// test()
// console.log(
//   predict(
//     fArr,
//     "PRIVATE! Your 2003 Account Statement for shows 800 un-redeemed S.I.M. points."
//   )
// );

// console.log(
//   R.union(
//     [
//       {
//         a: 1,
//         b: 2,
//       },
//     ],
//     [
//       {
//         a: 1,
//         b: 2,
//       },
//     ]
//   )
// );
