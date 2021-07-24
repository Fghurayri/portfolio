const WORDS_PER_MINUTE = 180;
const WORDS_TO_FILTER = ["\n", "export", "const", "prerender", "=", "script"];

const filterFn = (text) =>
  WORDS_TO_FILTER.every((word) => !text.includes(word));

export function estimateReadingTime(text) {
  const wordsCount = text.split(" ").filter(filterFn).length;
  return Math.ceil(wordsCount / WORDS_PER_MINUTE);
}
