import { m, route } from "./deps/mithril.js";

export const IndexPage = (state, actions) => () => ({
  view() {
    const numOfColumns = Object.keys(state).length;
    // assuming here that we're well behaved and that all columns have the same
    // amount of rows
    const numOfRows = Object.keys(state[0].questions).length;

    const style = {
      // makes all columns the same width
      gridTemplateColumns: `repeat(${numOfColumns}, 1fr)`,
      // second element is a separator row, to create a gap after the topic row
      gridTemplateRows: `1fr 0.15fr repeat(${numOfRows}, 1fr)`,
    };

    const toTopic = ([topicId, topic]) =>
      Topic(actions, topic.title, topicId, topic.questions);

    return m("div#index", { style }, Object.entries(state).map(toTopic));
  },
});

export const QuestionPage = (topics) => ({
  view: (vnode) =>
    m(
      "div.question-page-text",
      // if I don't put each line in its own div, they will appear on the same
      // line
      topics[vnode.attrs.topicId].questions[vnode.attrs.difficulty]
        .trim()
        .split("\n")
        .map((line) => m("div", line))
    ),
});

export const State = (topics) =>
  Object.fromEntries(
    topics.map(({ title, questions }, topicId) => [
      topicId,
      {
        title,
        questions: Object.fromEntries(
          Object.entries(questions).map(([difficulty, questionText]) => [
            difficulty,
            {
              questionText,
              burnt: false,
              difficulty,
            },
          ])
        ),
      },
    ])
  );

export const Actions = (state) => ({
  burn(topicId, difficulty) {
    state[topicId].questions[difficulty].burnt = true;
  },
});

const difficulties = {
  1: "קלי קלות",
  2: "מאתגר",
  3: "קשה אש",
};

/** A column of questions in index page, with the topic title as the first row. */
const Topic = (actions, title, topicId, questions) => {
  const buttons = Object.keys(questions).map((questionDifficulty) => {
    const q = questions[questionDifficulty];
    return QuestionButton(actions, q.burnt, questionDifficulty, topicId);
  });

  return [
    m("div.index-button.index-page-topic-title", title),
    m("div.index-title-gap", ""),
    ...buttons,
  ];
};

const QuestionButton = (actions, burnt, difficulty, topicId) =>
  m(
    "a.index-button.question.glow-on-hover",
    {
      class: burnt ? "burnt" : null,
      onclick: () => {
        actions.burn(topicId, difficulty);
        route.set(`/q/${topicId}/${difficulty}`);
      },
    },
    difficulties[difficulty]
  );
