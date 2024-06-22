const createState = require("./createState");
const transitions = require("./transitions");

function fromSymbol(symbol) {
  const start = createState(false);
  const end = createState(true);

  transitions.addTransition(symbol, start, end);
  return { start, end };
}

function fromEpsilon() {
  const start = createState(false);
  const end = createState(true);
  transitions.addEpsilonTransition(start, end);
  return { start, end };
}

module.exports = { fromSymbol, fromEpsilon };
