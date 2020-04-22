export type DatasetItem = {
  type: 'spam' | 'ham',
  text: string
}

export type FreqItem = {
  word: string,
  countSpam: number,
  countHam: number
}