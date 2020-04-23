export type DatasetItem = {
  type: "spam" | "ham";
  text: string;
};

export type FreqItem = {
  word: string;
  countSpam: number;
  countHam: number;
};

export type PredictResult = {
  spam: number;
  ham: number;
};

export type CountedWords = {
  countHam: number;
  countSpam: number;
  countTotal?: number;
};

export type WordProbability = {
  word: string;
  p_ham: number;
  p_spam: number;
};
