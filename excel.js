import { read as readXLSX } from "./deps/xlsx.mjs";

/**
 * Turn Sheet into an array of topics with questions.
 * For example, turns the following table:
 *
 *   Topic1 topic2 topic3
 *   a      b      c
 *   d      e      f
 *   g      h      i
 *
 * Into:
 *
 *   [
 *     { title: 'Topic1', questions: { '1': 'a', '2': 'd', '3': 'g' } },
 *     { title: 'topic2', questions: { '1': 'b', '2': 'e', '3': 'h' } },
 *     { title: 'topic3', questions: { '1': 'c', '2': 'f', '3': 'i' } }
 *   ]
 */
function topicsInSheet(sheet) {
  const topics = {};

  // skip first element because it's the special value `!ref`
  for (const k of Object.keys(sheet).slice(1, -1)) {
    const cellContent = sheet[k].v;

    // columns are letters, used to identify topics
    // rows are numbers, represent difficulty
    const [, columnNum, rowNum] = k.match(/([A-Z]+?)([0-9]+)/);

    // first row contains topic titles
    if (rowNum === "1") {
      topics[columnNum] = { title: cellContent, questions: {} };
    } else {
      const difficulty = parseInt(rowNum) - 1;
      topics[columnNum].questions[difficulty] = cellContent;
    }
  }

  return Object.values(topics);
}

export function parseXlsx(uploadedXlsxFile) {
  const xlsx = readXLSX(uploadedXlsxFile);
  const firstSheet = Object.values(xlsx.Sheets)[0];
  return topicsInSheet(firstSheet);
}
