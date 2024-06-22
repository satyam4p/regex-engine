/**
 * creates state for the given transition
 * @param {} isEnd
 * @returns
 */
function createState(isEnd) {
  return {
    isEnd,
    transition: {},
    epsilonTransition: [],
  };
}

/**
 * addEpsilon transition
 * @param {*} from
 * @param {*} to
 */
function addEpsilonTransition(from, to) {}

/**
 * adds symbolic transition which excepts an input symbol
 * @param {*} from
 * @param {*} to
 * @param {*} symbol
 */
function addTransition(from, to, symbol) {}

function fromEpsilon() {
  const start = createState(false);
  const end = createState(true);
  addEpsilonTransition(start, end);

  return {
    start,
    end,
  };
}

function fromSymbol(symbol) {
  const start = createState(false);
  const end = createState(true);
  addTransition(start, end, symbol);

  return {
    start,
    end,
  };
}

/************ NFA operations -start ***********/

/**
 * the concat operation will ensure to concatinate two smaller NFAs where first and second are two NFAs
 * @param {*} first
 * @param {*} second
 * @returns
 */
function concat(first, second) {
  //first.end would be from state for epsilon transition and second.start would be end state
  addEpsilonTransition(first.end, second.start);

  first.end.isEnd = false;

  return {
    start: first.start,
    end: second.end,
  };
}

function union(first, second) {
  const start = createState(false);
  addEpsilonTransition(start, first.start);
  addEpsilonTransition(start, second.start);

  const end = createState(true);
  addEpsilonTransition(first.end, end);
  first.end.isEnd = false;
  addEpsilonTransition(second.end, end);
  second.end.isEnd = false;
  return {
    start,
    end,
  };
}

function closure(nfs) {
  const start = createState(false);
  const end = createState(true);

  addEpsilonTransition(start, end);
  addEpsilonTransition(start, nfs.start);

  addEpsilonTransition(nfs.end, end);
  addEpsilonTransition(nfs.end, nfs.start);
  nfs.end.isEnd = false;

  return { start, end };
}
/************ NFA operations -end ***********/

/** scanning postfix expressions */

/*when we scan a char we cosntruct a cahracter NFS and push it to the stack */
/*when we scan an operator, we pop from the stack, apply this operation to NFAs and push the resulting NFA back to the stack  */

function toNFA(postfixExp) {
  if (postfixExp === "") {
    return fromEpsilon();
  }

  const stack = [];

  for (const token of postfixExp) {
    if (token === "*") {
      stack.push(closure(stack.pop()));
    } else if (token === "|") {
      const right = stack.pop();
      const left = stack.pop();
      stack.push(union(left, right));
    } else if (token === ".") {
      const right = stack.pop();
      const left = stack.pop();
      stack.push(closure(left, right));
    } else {
      stack.push(fromSymbol(token));
    }
  }
  return stack.pop();
}

console.log(toNFA("ab∣*c."));
