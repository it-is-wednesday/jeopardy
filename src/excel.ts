import * as SheetJS from "xlsx";

type Question = {
  title: string;
  questions: {
    [difficulty: string]: string;
  };
};

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
function topicsInSheet(sheet: SheetJS.WorkSheet) {
  const topics: { [i: string]: Question } = {};

  for (const k of Object.keys(sheet)) {
    if (k === "!ref" || k === "!margins") {
      continue;
    }

    const cellContent = sheet[k].v;

    // columns are letters, used to identify topics
    // rows are numbers, represent difficulty
    const [, columnNum, rowNum] = k.match(/([A-Z]+?)([0-9]+)/)!;

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

export function parseXlsx(uploadedXlsxFile: Blob) {
  const xlsx = SheetJS.read(uploadedXlsxFile);
  const firstSheet = Object.values(xlsx.Sheets)[0];
  return topicsInSheet(firstSheet);
}
