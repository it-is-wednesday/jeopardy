import { m } from "./deps/mithril.js";

export const IndexPage = (topics) => () => {
  const state = State(topics);
  const actions = Actions(state);

  return {
    view() {
      return m(
        "div.index",
        Object.entries(state).map(([topicId, topic]) =>
          Topic(actions, topic.title, topicId, topic.questions)
        )
      );
    },
  };
};

export const QuestionPage = (topics) => ({
  view(vnode) {
    console.log(topics[vnode.attrs.topicId]);
    return m("div", topics[vnode.attrs.topicId].questions[vnode.attrs.difficulty]);
  },
});

const difficulties = {
  1: "קלי קלות",
  2: "מאתגר",
  3: "קשה אש",
};

const State = (topics) =>
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

const Actions = (state) => ({
  burn: (topicId, difficulty) => console.log("dont forget to implement ;)"),
});

/** A column of questions in index page, with the topic title as the first row. */
const Topic = (actions, title, topicId, questions) => {
  const buttons = Object.keys(questions).map((questionDifficulty) => {
    const q = questions[questionDifficulty];
    return QuestionButton(actions, q.burnt, questionDifficulty, topicId);
  });
  return m("div.topic", [m("div.index-button.topic-title", title), ...buttons]);
};

const QuestionButton = (actions, burnt, difficulty, topicId) =>
  m(
    "a.index-button.question",
    {
      href: `#!/q/${topicId}/${difficulty}`,
      onclick: () => actions.burn(topicId, difficulty),
    },
    difficulties[difficulty]
  );
