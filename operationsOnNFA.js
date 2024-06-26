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

/**converting a regex into postfix notation */
const operatorPrecedence = {
  "|": 1,
  ".": 2,
  "*": 3,
  "?": 3,
  "+": 3,
};

const isRightAssociative = (operator) => {
  return operator === "*" || operator === "?" || operator === "+";
};

const peek = (array) => array[array.length - 1];

function addExplicitConcatenation(regex) {
  let result = "";
  const length = regex.length;

  for (let i = 0; i < length; i++) {
    result += regex[i];

    if (i < length - 1) {
      const current = regex[i];
      const next = regex[i + 1];

      if (
        current !== "(" &&
        current !== "|" &&
        next !== ")" &&
        next !== "|" &&
        next !== "*" &&
        next !== "?" &&
        next !== "+"
      ) {
        result += ".";
      }
    }
  }

  return result;
}

function toPostfix(regex) {
  let output = "";
  const operatorStack = [];

  regex = addExplicitConcatenation(regex);

  for (const token of regex) {
    if (
      token === "." ||
      token === "|" ||
      token === "*" ||
      token === "?" ||
      token === "+"
    ) {
      while (
        operatorStack.length &&
        peek(operatorStack) !== "(" &&
        ((isRightAssociative(token) &&
          operatorPrecedence[peek(operatorStack)] >
            operatorPrecedence[token]) ||
          (!isRightAssociative(token) &&
            operatorPrecedence[peek(operatorStack)] >=
              operatorPrecedence[token]))
      ) {
        output += operatorStack.pop();
      }
      operatorStack.push(token);
    } else if (token === "(" || token === ")") {
      if (token === "(") {
        operatorStack.push(token);
      } else {
        while (peek(operatorStack) !== "(") {
          output += operatorStack.pop();
        }
        operatorStack.pop(); // Remove the '(' from the stack
      }
    } else {
      output += token;
    }
  }

  while (operatorStack.length) {
    output += operatorStack.pop();
  }

  return output;
}

module.exports = { toPostfix };
