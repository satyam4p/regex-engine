function addEpsilonTransition(fromState, toState) {
  fromState.epsilonTransitions.push(toState);
}

function addTransition(symbol, fromState, toState) {
  fromState.transitions[symbol] = toState;
}

module.exports = { addEpsilonTransition, addTransition };
