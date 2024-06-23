const createState = require("./createState");
const transitions = require("./transitions");
const NFA = require("./NFAs");

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

/**function to parse a postfix expression, and store the results into stack and do operations as well.
 * The stack contains NFAs
 * when we scan a character, we construct a character NFA and push it to the stack
 * when we scan an operator we pop from the stack and apply this operation on the NFA(s) and push the resulting NFA back to the stack.
 */
function toNFA(postfixExp) {
  if (postfixExp === "") {
    return fromEpsilon();
  }

  const stack = [];

  for (let token of postfixExp) {
    if (token === "*") {
      stack.push(closure(stack.pop()));
    } else if (token === "|") {
      let first = stack.pop();
      let second = stack.pop();
      stack.push(union(first, second));
    } else if (token === ".") {
      let first = stack.pop();
      let second = stack.pop();
      stack.push(concat(first, second));
    } else {
      stack.push(NFA.fromSymbol(token));
    }
  }
  return stack.pop();
}
