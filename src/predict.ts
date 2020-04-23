import R from "ramda";

import { getWordsFromRow } from "./train";
import {
  CountedWords,
  FreqItem,
  PredictResult,
  WordProbability,
} from "./types";

export const countWordsByClassInArr = (freqArr: FreqItem[]): CountedWords =>
  freqArr.reduce((prev, cur) => ({
    ...cur,
    countSpam: prev.countSpam + cur.countSpam,
    countHam: prev.countHam + cur.countHam,
    countTotal: prev.countSpam + cur.countSpam + prev.countHam + cur.countHam,
  }));

const logarithmCounter = (accumulator: number, val: number): number =>
  accumulator + Math.log2(val);

const countRate = (arr: WordProbability[]): PredictResult => {
  return {
    ham: arr.map((item) => item.p_ham).reduce(logarithmCounter, 1),
    spam: arr.map((item) => item.p_spam).reduce(logarithmCounter, 1),
  };
};

export const predict = (freqArr: FreqItem[], text: string): PredictResult => {
  const words = getWordsFromRow(text);
  const wordStat = countWordsByClassInArr(freqArr);

  const pArr: WordProbability[] = R.reject(
    R.isNil,
    words.map((word) => {
      const freqItem = R.find((item) => item.word === word, freqArr);
      if (!freqItem) return;
      return {
        word,
        p_spam:
          (freqItem.countSpam === 0 ? 1 : freqItem.countSpam) /
          wordStat.countSpam,
        p_ham:
          (freqItem.countHam === 0 ? 1 : freqItem.countHam) / wordStat.countHam,
      };
    })
  );
  if (R.isEmpty(pArr))
    return {
      ham: 0,
      spam: 0,
    };

  return countRate(pArr);
};
