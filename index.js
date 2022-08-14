import { mount } from "./deps/mithril.js";
import { App } from "./ui.js";
import { parseXlsx } from "./excel.js";

mount(document.querySelector("main"), App);

const fileInput = document.getElementById("xlsx");
fileInput.addEventListener("change", async () => {
  const uploadedFile = await fileInput.files[0].arrayBuffer();
  console.log(parseXlsx(uploadedFile));
});
