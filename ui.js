import { m, route } from "./deps/mithril.js";

export const IndexPage = (state, actions) => () => {
  return {
    view() {
      return m(
        "div.index",
        ...Object.entries(state).map(([topicId, topic]) =>
          Topic(actions, topic.title, topicId, topic.questions)
        )
      );
    },
  };
};

export const QuestionPage = (topics) => ({
  view(vnode) {
    const topic = topics[vnode.attrs.topicId];
    return m("div.question-page", [
      m("a", { href: "#!/" }, "back"),
      m("div.question-page-topic-title", topic.title),
      m("div.question-title", topic.questions[vnode.attrs.difficulty]),
    ]);
  },
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
