import { render } from "preact";
import { Router, Route } from "preact-router";
import { fairyDustCursor } from "./tinkerbell";
import { IndexPage } from "./ui";

export type State = {
  [topicId: string]: Topic;
};

export type Topic = {
  title: string;
  questions: {
    [difficulty: string]: { questionText: string; burnt: boolean; difficulty: string };
  };
};

function Main() {
  fairyDustCursor();

  return (
    <Router>
      <Route path="/" component={IndexPage} />
    </Router>
  );
}

render(<Main />, document.body);
