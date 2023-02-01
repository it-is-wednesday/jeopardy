import { render } from "preact";
import { Router, Route } from "preact-router";
import { fairyDustCursor } from "./tinkerbell";
import { IndexPage } from "./ui";

fairyDustCursor();

function Main() {
  return (
    <Router>
      <Route path="/" component={IndexPage} />
    </Router>
  );
}

render(<Main />, document.body);
