function addEpsilonTransition(fromState, toState) {
  fromState.epsilonTransitions.push(toState);
}

function addTransition(symbol, fromState, toState) {
  fromState.transition[symbol] = toState;
}

module.exports = { addEpsilonTransition, addTransition };
