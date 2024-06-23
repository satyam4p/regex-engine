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
function concat(firstState, secondState) {
  transitions.addEpsilonTransition(firstState.end, secondState.start);
  firstState.end.isEnd = false;
  return { start: firstState.start, end: secondState.end };
}

/**kleen star closure */
function closure(nfa) {
  const start = createState(false);
  const end = createState(true);

  addEpsilonTransition(start, end);
  addEpsilonTransition(start, nfa.start);

  addEpsilonTransition(nfa.end, end);
  addEpsilonTransition(nfa.end, nfa.start);
  nfa.end.isEnd = false;

  return { start, end };
}
