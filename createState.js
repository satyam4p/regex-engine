function createState(isEnd) {
  return {
    isEnd,
    transition: {},
    epsilonTransitions: [],
  };
}

module.exports = createState;
