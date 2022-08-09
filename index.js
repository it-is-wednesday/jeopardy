import { read as readXLSX, utils } from "./xlsx.mjs";
import * as m from "./mithril.js";
const fileInput = document.getElementById("xlsx");

function rowsInSheet(sheet, columnCount, rowCount) {
  for (let letter = 0; letter < columnCount; letter++) {
    const letterString = (letter + 10).toString(36).toUpperCase();
    for (let number = 1; number <= rowCount; number++)
      console.log(`${letterString}${number}`);
  }
}

/** The `!ref` property is something like A1:C4 */
function refToCounts(ref) {
  const matches = ref.match(/\w+:(\w+)(\d+)/);
  console.log(ref);
  console.log(matches);
  return {
    // parsing an a-z character into its ascii code
    rowCount: parseInt(matches[2]),
    columnCount: parseInt(matches[1], 36) - 9,
  };
}

fileInput.addEventListener("change", async () => {
  const wb = readXLSX(await fileInput.files[0].arrayBuffer());
  const sheet = wb.Sheets.Sheet1;
  const { rowCount, columnCount } = refToCounts(sheet["!ref"]);
  rowsInSheet(sheet, columnCount, rowCount);
});
