import { route } from "preact-router";
import type { State, Topic, Actions, QuestionId } from "./index";

/** Shows a big picture, should be shown when the crowd is gathering */
export function SplashPage() {
  return <div className="splash-page" onClick={() => route("/main")}></div>;
}

type IndexPageProps = {
  state: State;
  actions: Actions;
};

const difficulties = [
  "בדיחה",
  "קליל",
  "קל",
  "בינוני",
  "קשה",
  "קשה מאוד",
  "קיצוני",
];

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
    <div id="index" style={style}>
      {...state.map((topic, index) => makeTopicComponent(topic, index))}
      {scores}
    </div>
  );
}

type QuestionPageProps = {
  state: State;
  topicId: string;
  difficulty: string;
};

export function QuestionPage({
  state,
  topicId,
  difficulty,
}: QuestionPageProps) {
  const difficultyNum = parseInt(difficulty);
  const topicIdNum = parseInt(topicId);
  // if I don't put each line in its own div, they will appear on the same line
  const lines = state[topicIdNum].questions[difficultyNum].questionText
    .toString()
    .trim()
    .split("\n")
    .map((line) => <div>{line}</div>);
  console.log(state[topicIdNum].questions[difficultyNum]);
  return <div class="question-page-text">{...lines}</div>;
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
