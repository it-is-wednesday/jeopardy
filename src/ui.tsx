import { route } from "preact-router";
import type { State, Topic } from "./index";

type QuestionId = { topicId: number; difficulty: number };

export function SplashPage() {
  return <div className="splash-page" onClick={() => route("/index")}></div>;
}

type IndexPageProps = {
  state: State;
  actions: Actions;
};

export function IndexPage({ state, actions }: IndexPageProps) {
  const numOfColumns = Object.keys(state).length;
  // assuming here that we're well behaved and that all columns have the same
  // amount of rows
  const numOfRows = Object.keys(state[0].questions).length;

  const style = {
    // makes all columns the same width
    // last column is scores
    gridTemplateColumns: `repeat(${numOfColumns}, 1fr) 0.5fr`,
    // second element is a separator row, to create a gap after the topic row
    gridTemplateRows: `1fr 0.15fr repeat(${numOfRows}, 1fr)`,
  };

  const makeTopicComponent = ({ title, questions }: Topic, topicId: number) => (
    <TopicComponent
      actions={actions}
      title={title}
      topicId={topicId}
      questions={questions}
    ></TopicComponent>
  );

  // These are the 100, 200, 300... on the right side
  const scores = (
    <>
      <div></div>
      <div></div>
      {...Object.keys(difficulties)
        .slice(0, numOfRows)
        .map((num) => (
          <div className="score">
            <div className="shekel">₪</div>
            <div>{`${num}00`}</div>
          </div>
        ))}
    </>
  );

  return (
    <div className="index" style={style}>
      {...state.map((topic, index) => makeTopicComponent(topic, index))}
      {scores}
    </div>
  );
}

export const makeActions = (state: State) => ({
  burn({ topicId, difficulty }: QuestionId) {
    state[topicId].questions[difficulty].burnt = true;
  },
});
type Actions = ReturnType<typeof makeActions>;

type QuestionPageProps = {
  state: State;
  question: QuestionId;
};

export function QuestionPage({ state, question }: QuestionPageProps) {
  // if I don't put each line in its own div, they will appear on the same line
  const lines = state[question.topicId].questions[question.difficulty]
    .toString()
    .trim()
    .split("\n")
    .map((line) => <div>{line}</div>);
  return <div class="question-page-text">{lines}</div>;
}

type TopicProps = {
  actions: Actions;
  title: string;
  topicId: number;
  questions: Topic["questions"];
};

/** A column of questions in index page, with the topic title as the first row. */
function TopicComponent({ actions, title, topicId, questions }: TopicProps) {
  const buttons = questions.map((question, difficulty) => {
    return (
      <QuestionButton
        actions={actions}
        burnt={question.burnt}
        question={{ difficulty, topicId }}
      ></QuestionButton>
    );
  });

  return (
    <>
      <div className="index-button index-page-topic-title">{title}</div>
      <div className="index-title-gap"></div>
      {buttons}
    </>
  );
}

const difficulties = [
  "בדיחה",
  "קליל",
  "קל",
  "בינוני",
  "קשה",
  "קשה מאוד",
  "קיצוני",
];

type QuestionButtonProps = {
  actions: Actions;
  burnt: boolean;
  question: QuestionId;
};

function QuestionButton({ actions, burnt, question }: QuestionButtonProps) {
  const burntClass = burnt ? "burnt" : null;
  const classes = `index-button question glow-on-hover ${burntClass}`;
  const onClick = () => {
    actions.burn(question);
    route(`/q/${question.topicId}/${question.difficulty}`);
  };
  return (
    <a className={classes} onClick={onClick}>
      {difficulties[question.difficulty]}
    </a>
  );
}
