const createState = require("./createState");
const transitions = require("./transitions");

/**performs union of two states */
function uniion(firstState, secondState) {
  const start = createState(false);

  transitions.addEpsilonTransition(start, firstState.start);
  transitions.addEpsilonTransition(start, secondState.start);
  const end = createState(true);

  transitions.addEpsilonTransition(firstState.end, end);
  firstState.end.isEnd = false;
  transitions.addEpsilonTransition(secondState.end, end);
  secondState.end.isEnd = false;
  return { start, end };
}

/**does concatenation operation between two states */
function concat(firstState, secondState) {}
