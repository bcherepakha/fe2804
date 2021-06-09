const log = function (message) {
    // this = undefined | Window
    // arguments = { 0: 'Hello, world!', length: 1 }
    console.log(message);
};

log('Hello, world!'); // LE: { message: 'Hello, world!' }

const a = {
    log: log
};

a.log('I am a!'); // LE: { message: 'I am a!' }
// arguments = { 0: 'I am a!', length: 1 }
// this = a

const b = {
    c: {
        log
    }
};

b.c.log('Who am I?'); // this = b.c

const log2 = b.c.log;

log2('I am log2!'); // this = undefined | Window

const d = 8;

//* LE = { d: 8 }
function init(a, b) {
    function sum() {
        return a + b + d;
    }

    console.log(
        sum() //* LE3 = {  }
    );

    return sum;
}

const s1 = init(1, 2); //* LE1 = { a: 1, b: 2, sum } sum.[[Scope]] = LE1 => 11
const s2 = init(3, 4); //* LE2 = { a: 3, b: 4, sum } sum.[[Scope]] = LE2 => 15
//* LE1.sum !== LE2.sum

console.log( s1() ); //* LE4 = {  } => 3
console.log( s2() ); //* 7

function hello(a, b, c) {
    console.log(this);
}

hello(1, 2, 3); //* undefined | Window (6)
hello.call(1, 2, 3); //* this = 1 (2 + 3 + undefined => NaN)
hello.call({ name: 'hello' }, 5, 5, 5); //* this = { name: 'hello' } (15)

hello.apply('apply this', [1, 2, 3]); //* this = 'apply this' (6)
hello.apply(undefined, [3, 3, 4]); //* this = undefined (10)

function sum(a, b) {
    return a+b;
}

sum(1, 2); //* 3
sum.call(null, 1, 2); //* 3
sum.call(1, 2); //* this = 1; a=2; b=undefined

function bind(f, context) {
    return function s() {
        //* this = q
        return f.call(context);
    };
}

const h = bind(hello, 'this is h'); //* LE1 = { f: hello, context: 'this is h', s }

h(); //* LE2 = {  } hello.call('this is h') => 'this is h'
h.call('this is called'); //* LE3 = {  } hello.call('this is h') => 'this is h'

const q = { h };

q.h(); //* 'this is h'

const hh = hello.bind('this is hh');

hh(); //* 'this is hh'

const plus3 = sum.bind(null, 3);

plus3(5); //* sum(3, 5) => 8
plus3(7); //* 10
