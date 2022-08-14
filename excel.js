import { read as readXLSX, utils } from "./deps/xlsx.mjs";

function rowsInSheet(sheet, columnCount, rowCount) {
  for (let letter = 0; letter < columnCount; letter++) {
    const letterString = (letter + 10).toString(36).toUpperCase();
    for (let number = 1; number <= rowCount; number++)
      console.log(`${letterString}${number}`);
  }
}

/** Example `!ref` property: `A1:C4` */
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

export function parseXlsx(uploadedXlsxFile) {
  const xlsx = readXLSX(uploadedXlsxFile);
  const firstSheet = Object.values(xlsx.Sheets)[0];
  return refToCounts(firstSheet["!ref"])
}
