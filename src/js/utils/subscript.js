/**
 * https://github.com/dy/subscript
 * ISC License (ISC)
 * Copyright 2021 Dmitry Iv.
 */

// Customized for Media Chrome theme template syntax

// subscript.js
// prettier-ignore
const PERIOD=46, SPACE=32, DQUOTE=34, QUOTE=39, _0=48, _9=57,
      PREC_SOME=4, PREC_EVERY=5, PREC_OR=6, PREC_EQ=9, PREC_COMP=10, PREC_UNARY=15;

const filters = {
  // Filters concept like Nunjucks or Liquid.
  string: (value) => String(value),
  number: (value) => Number(value),
  boolean: (value) => Boolean(value),
};

// prettier-ignore
export const subscript = s => (s=parse(s), ctx => {
  ctx = { ...filters, ...ctx };
  return (s.call?s:(s=compile(s)))(ctx)
});

// prettier-ignore
const num = (a) => a ? err() : ['', (a=+skip(c => c === PERIOD || (c>=_0 && c<=_9) || (c===69||c===101?2:0)))!=a?err():a];

// prettier-ignore
const str = (q) => (a) => a ? err() : ['', (skip() + skip(c => c - q ? 1 : 0) + (skip()||err('Bad string'))).slice(1,-1)];

// prettier-ignore
const list = [
  // literals
  // null operator returns first value (needed for direct literals)
  '',, [,v => () => v],

  '"',, [str(DQUOTE)],
  "'",, [str(QUOTE)],

  // .1
  '.',, [a=>!a && num()],

  // 0-9
  ...Array(10).fill(0).flatMap((_,i)=>[''+i,0,[num]]),

  'null', 20, [a => a ? err() : ['',null]],
  'true', 20, [a => a ? err() : ['',true]],
  'false', 20, [a => a ? err() : ['',false]],
  'undefined', 20, [a => a ? err() : ['',undefined]],

  // sequences
  '||', PREC_SOME, (...args) => { let i=0, v; for (; !v && i < args.length; ) v = args[i++]; return v },
  '&&', PREC_EVERY, (...args) => { let i=0, v=true; for (; v && i < args.length; ) v = args[i++]; return v },
  '??', PREC_OR, (a,b) => a ?? b,
  '|', PREC_OR, (a,b) => b(a),

  // binaries
  '==', PREC_EQ, (a,b)=>a==b,
  '!=', PREC_EQ, (a,b)=>a!=b,
  '>', PREC_COMP, (a,b)=>a>b,
  '>=', PREC_COMP, (a,b)=>a>=b,
  '<', PREC_COMP, (a,b)=>a<b,
  '<=', PREC_COMP, (a,b)=>a<=b,

  // unaries
  '!', PREC_UNARY, a => !a,
];

// set any operator
// right assoc is indicated by negative precedence (meaning go from right to left)
// prettier-ignore
function set(op, prec, fn) {
  return (fn[0]||fn[1]) ? (prec ? token(op,prec,fn[0]) : (lookup[op.charCodeAt(0)||1]=fn[0]), operator(op, fn[1])) : (
    !fn.length ? (
      nary(op, prec),
      operator(op, (...args) => (args=args.map(compile), ctx => fn(...args.map(arg=>arg(ctx)))))
    ) : fn.length > 1 ? (
      binary(op, Math.abs(prec), prec<0),
      operator(op, (a,b) => b && (a=compile(a),b=compile(b), !a.length&&!b.length ? (a=fn(a(),b()),()=>a) : ctx => fn(a(ctx),b(ctx))))
    ) : (
      unary(op, prec),
      operator(op, (a,b) => !b && (a=compile(a), !a.length ? (a=fn(a()),()=>a) : ctx => fn(a(ctx))))
    )
  );
}

// compile.js
// build optimized evaluator for the tree
const compile = (node) =>
  !Array.isArray(node)
    ? (ctx) => ctx?.[node]
    : operators[node[0]](...node.slice(1));

const operators = {};

const operator = (op, fn, prev = operators[op]) =>
  (operators[op] = (...args) => fn(...args) || (prev && prev(...args)));

// parse.js
// current string, index and collected ids
let idx;
let cur;

// no handling tagged literals since easily done on user side with cache, if needed
let parse = (s) => (
  (idx = 0), (cur = s), (s = expr()), cur[idx] ? err() : s || ''
);

let err = (
  msg = 'Bad syntax',
  frag = cur[idx],
  prev = cur.slice(0, idx).split('\n'),
  last = prev.pop()
) => {
  throw SyntaxError(`${msg} \`${frag}\` at ${prev.length}:${last.length}`);
};

/**
 * @param  {number|Function} is
 * @param  {number} [from]
 * @param  {number} [l]
 * @return {string}
 */
let skip = (is = 1, from = idx, l) => {
  if (typeof is == 'number') idx += is;
  else while ((l = is(cur.charCodeAt(idx)))) idx += l;
  return cur.slice(from, idx);
};

// a + b - c
let expr = (prec = 0, end, cc, token, newNode, fn) => {
  // chunk/token parser
  while (
    (cc = parse.space()) && // till not end
    // FIXME: extra work is happening here, when lookup bails out due to lower precedence -
    // it makes extra `space` call for parent exprs on the same character to check precedence again
    (newNode =
      ((fn = lookup[cc]) && fn(token, prec)) ?? // if operator with higher precedence isn't found
      (!token && parse.id())) // parse literal or quit. token seqs are forbidden: `a b`, `a "b"`, `1.32 a`
  )
    token = newNode;

  // check end character
  // FIXME: can't show "Unclose paren", because can be unknown operator within group as well
  if (end) cc == end ? idx++ : err();

  return token;
};

let isId = (c) =>
  (c >= 48 && c <= 57) || // 0..9
  (c >= 65 && c <= 90) || // A...Z
  (c >= 97 && c <= 122) || // a...z
  c == 36 ||
  c == 95 || // $, _,
  (c >= 192 && c != 215 && c != 247); // any non-ASCII

// skip space chars, return first non-space character
parse.space = (cc) => {
  while ((cc = cur.charCodeAt(idx)) <= SPACE) idx++;
  return cc;
};

parse.id = () => skip(isId);

// operator/token lookup table
// lookup[0] is id parser to let configs redefine it
let lookup = [];
// create operator checker/mapper (see examples)
let token = (
  op,
  prec = SPACE,
  map,
  c = op.charCodeAt(0),
  l = op.length,
  prev = lookup[c],
  word = op.toUpperCase() !== op // make sure word boundary comes after word operator
) =>
  (lookup[c] = (a, curPrec, from = idx) =>
    (curPrec < prec &&
      (l < 2 || cur.substr(idx, l) == op) &&
      (!word || !isId(cur.charCodeAt(idx + l))) &&
      ((idx += l), map(a, curPrec))) ||
    ((idx = from), prev?.(a, curPrec)));

// right assoc is indicated by negative precedence (meaning go from right to left)
let binary = (op, prec, right) => // @ts-ignore
  token(op, prec, (a, b) => a && (b = expr(prec - !!right)) && [op, a, b]);

let unary = (op, prec, post) =>
  token(op, prec, (a) =>
    post ? a && [op, a] : !a && (a = expr(prec - 1)) && [op, a]
  );

let nary = (op, prec, skips) =>
  token(
    op,
    prec,
    (a, b) =>
      a &&
      ((b = expr(prec)), b || skips) &&
      (a[0] === op && a[2] ? (a.push(b || null), a) : [op, a, b])
  );

for (; list[2]; ) set(...list.splice(0, 3));
