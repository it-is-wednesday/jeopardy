import { render } from "preact";
import { produce } from "immer";
import { Router, Route } from "preact-router";
import { startFairyDustCursor } from "./tinkerbell";
import { IndexPage, QuestionPage, SplashPage } from "./ui";
import { WelcomePage } from "./welcomePage";
import { useState } from "preact/hooks";

startFairyDustCursor();

export type QuestionId = { topicId: number; difficulty: number };

export type Topic = {
  title: string;
  questions: {
    [id: number]: {
      questionText: string;
      burnt: boolean;
    };
  };
};

export type State = { [id: number]: Topic };

function Main() {
  const [state, setState] = useState<State>({});

  const burn = ({ topicId, difficulty }: QuestionId) =>
    setState((state) =>
      produce(state, (draft) => {
        draft[topicId].questions[difficulty].burnt = true;
      })
    );

  return (
    <Router>
      <Route path="/" component={WelcomePage} setState={setState} />
      <Route path="/main" component={IndexPage} state={state} burn={burn} />
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
