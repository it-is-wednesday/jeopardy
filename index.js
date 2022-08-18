import { fairyDustCursor } from "./tinkerbell.js";
fairyDustCursor();

import { route } from "./deps/mithril.js";
import { IndexPage, QuestionPage, State, Actions } from "./ui.js";
import { parseXlsx } from "./excel.js";

const fileInput = document.getElementById("xlsx");

fileInput.addEventListener("change", async () => {
  const uploadedFile = await fileInput.files[0].arrayBuffer();
  const topics = parseXlsx(uploadedFile);

  const state = State(topics);
  const actions = Actions(state);

  route(document.querySelector("main"), "/index", {
    "/index": IndexPage(state, actions),
    "/q/:topicId/:difficulty": QuestionPage(topics),
  });
});

// Should be used in `QuestionPage`s because I deliberately didn't include a
// back button there because there isn't a back button in the original Jeopardy
// duh...
window.addEventListener(
  "keydown",
  (event) => event.key === "Backspace" && route.set("/")
);
