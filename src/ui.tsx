import { route } from "preact-router";
import type { State } from "./index";

type QuestionId = { topicId: string; difficulty: string };

export function SplashPage() {
  return <div className="splash-page" onClick={() => route("/index")}></div>;
}

export const makeActions = (state: State) => ({
  burn({ topicId, difficulty }: QuestionId) {
    state[topicId].questions[difficulty].burnt = true;
  },
});

type Actions = ReturnType<typeof makeActions>;

function QuestionButton(
  actions: Actions,
  burnt: boolean,
  question: QuestionId
) {
  const burntClass = burnt ? "burnt" : null;
  const classes = `index-button question glow-on-hover ${burntClass}`;
  const onClick = () => {
    actions.burn(question);
    route(`/q/${question.topicId}/${question.difficulty}`);
  };
  return <a className={classes} onClick={onClick}></a>;
}

export function IndexPage() {
  return <div>hello</div>;
}
