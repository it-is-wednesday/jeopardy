import * as SheetJS from "xlsx";
import type { State } from "./index";

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
function stateFromSheet(sheet: SheetJS.WorkSheet): State {
  const state: State = {};

  for (const k of Object.keys(sheet)) {
    if (k === "!ref" || k === "!margins") {
      continue;
    }

    const cellContent: string = sheet[k].v;

    // columns are letters, used to identify topics
    // rows are numbers, represent difficulty
    const [, columnLetter, rowNumStr] = k.match(/([A-Z]+?)([0-9]+)/)!;
    const columnNum = columnLetter.charCodeAt(0) - 65;

    // first row contains topic titles
    if (rowNumStr === "1") {
      state[columnNum] = { title: cellContent, questions: {} };
    } else {
      // subtracting 2 because the first row was the topic title, and SheetJS
      // has 1-based index
      const difficulty = parseInt(rowNumStr) - 2;
      state[columnNum].questions[difficulty] = {
        questionText: cellContent,
        burnt: false,
      };
    }
  }

  return state;
}

export function parseXlsx(uploadedXlsxFile: ArrayBuffer): State {
  const xlsx = SheetJS.read(uploadedXlsxFile);
  const firstSheet = Object.values(xlsx.Sheets)[0];
  return stateFromSheet(firstSheet);
}
