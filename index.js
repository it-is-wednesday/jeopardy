import { fairyDustCursor } from "./tinkerbell.js";
fairyDustCursor();

import { route } from "./deps/mithril.js";
import { IndexPage, QuestionPage, State, Actions } from "./ui.js";
import { parseXlsx } from "./excel.js";

const fileInput = document.getElementById("xlsx");

fileInput.addEventListener("change", async () => {
  fileInput.hidden = true;
  const uploadedFile = await fileInput.files[0].arrayBuffer();
  const topics = parseXlsx(uploadedFile);

  const state = State(topics);
  const actions = Actions(state);

  route(document.querySelector("main"), "/index", {
    "/index": IndexPage(state, actions),
    "/q/:topicId/:difficulty": QuestionPage(topics),
  });
});
