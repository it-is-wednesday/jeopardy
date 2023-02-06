import { render } from "preact";
import { useState } from "preact/hooks";
import { Router, Route } from "preact-router";
import { startFairyDustCursor } from "./tinkerbell";
import { IndexPage, QuestionPage, SplashPage } from "./ui";
import { WelcomePage } from "./welcomePage";

startFairyDustCursor();

export type QuestionId = { topicId: number; difficulty: number };

export type Topic = {
  title: string;
  // the index number represents difficulty
  questions: {
    questionText: string;
    burnt: boolean;
  }[];
};

export type State = Topic[];

export type Actions = ReturnType<typeof makeActions>;

export const makeActions = (state: State) => ({
  burn({ topicId, difficulty }: QuestionId) {
    state[topicId].questions[difficulty].burnt = true;
  },
});

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
