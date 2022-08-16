import { route } from "./deps/mithril.js";
import { IndexPage, QuestionPage } from "./ui.js";
import { parseXlsx } from "./excel.js";

const fileInput = document.getElementById("xlsx");

fileInput.addEventListener("change", async () => {
  fileInput.hidden = true;
  const uploadedFile = await fileInput.files[0].arrayBuffer();
  const topics = parseXlsx(uploadedFile);

  route(document.querySelector("main"), "/index", {
    "/index": IndexPage(topics),
    "/q/:topicId/:difficulty": QuestionPage(topics),
  });
});
