import { render } from "preact";
import { useState } from "preact/hooks";
import { Router, Route } from "preact-router";
import { fairyDustCursor } from "./tinkerbell";
import { IndexPage, makeActions, QuestionPage, SplashPage } from "./ui";
import { WelcomePage } from "./welcomePage";

type Question = {
  questionText: string;
  burnt: boolean;
};

export type Topic = {
  title: string;
  questions: Question[]; // the index number represents difficulty
};

export type State = Topic[];

fairyDustCursor();

function Main() {
  const [state, setState] = useState<State>([]);
  const actions = makeActions(state);

  return (
    <Router>
      <Route path="/" component={WelcomePage} setState={setState} />
      <Route
        path="/main"
        component={IndexPage}
        state={state}
        actions={actions}
      />
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
