import { m } from "./deps/mithril.js";
const difficulties = {
  1: "easy",
};

const State = () => {
  let result = {};
  for (let i = 0; i < 20; i++)
    result[i] = {
      difficulty: 1,
      burnt: false,
    };

  return result;
};

const Actions = (state) => ({
  burn: (id) =>
    state[id].burnt ? (state[id].burnt = false) : (state[id].burnt = true),
});

/** A column of questions in index page, with the topic title as the first row. */
const Topic = (questions) => m("div.topic", questions);

const QuestionButton = (actions, burnt, difficulty, id) =>
  m("button", { class: ["question"], onclick: () => actions.burn(id) }, [
    m("div", difficulties[difficulty] + burnt.toString()),
  ]);

export const App = () => {
  const state = State();
  const actions = Actions(state);

  return {
    view: () =>
      m(
        "div.index",
        Topic(
          Object.keys(state).map((id) =>
            QuestionButton(actions, state[id].burnt, state[id].difficulty, id)
          )
        )
      ),
  };
};
