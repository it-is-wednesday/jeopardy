import { render } from "preact";
import { Router, Route } from "preact-router";
import { parseXlsx } from "./excel";
import { fairyDustCursor } from "./tinkerbell";
import { IndexPage, makeActions, QuestionPage, SplashPage } from "./ui";

type Question = {
  questionText: string;
  burnt: boolean;
};

export type Topic = {
  title: string;
  // index represents difficulty
  questions: Question[];
};

export type State = Topic[];

fairyDustCursor();

const fileInput = document.getElementById("xlsx")! as HTMLInputElement;

fileInput.addEventListener("change", async () => {
  const uploadedFile = await fileInput.files![0].arrayBuffer();
  const state = parseXlsx(uploadedFile);
  const actions = makeActions(state);

  function Main() {
    return (
      <Router>
        <Route path="/" component={IndexPage} state={state} actions={actions} />
        <Route path="/splash" component={SplashPage} />
        <Route
          path="/q/:topicId/:difficulty"
          component={QuestionPage}
          state={state}
        />
      </Router>
    );
  }

  render(<Main />, document.body);
});
