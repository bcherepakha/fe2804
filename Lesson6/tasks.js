// 1. Проверить является ли число круглым
// 2. Получить у пользователя два числа и узнать остаток от деления первого на второе
// 3. Получить у пользователя строку и узнать ее длину
// 4. Получить у пользователя два числа и назвать наибольшее
// 5. Получить у пользователя число и сказать входит ли оно в диаппазон от 30 до 50
// 6. Для доступа на сайт нужно ввести логин и пароль.
//    На сайте зарегистрировано четыре пользователя с паролями.
//    Получите у пользователя логин и пароль и скажите имеет ли он доступ на сайт

function isRound( num ) {
    return num % 10 === 0; // ===, !==, ==, !=
}

let result = isRound( 11 );

console.log( result ); // false

result = isRound( 15 );

console.log( result ); // false

result = isRound( 20 );

console.log( result ); // true

// &&, AND, *
// true && true => true
// true && false => false
// false && true => false
// false && false => false

// ||, OR, +
// true || true => true
// false || true => true
// true || false => true
// false || false => false

function getMod( a, b ) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        // throw new Error('a must be a number');
        return NaN;
    }

    return a % b;
}

console.log('getMod', getMod(12, 9) === 3 ); // 3
console.log('getMod', getMod('12', '9a') ); // 3

function getStringLength( str ) {
    return str.length;
}

console.log( 'abcd'.length === 4 );
console.log( 'getStringLength', getStringLength( 'Hello, John!' ) === 12);

console.log( (function (a, b) { return Math.max(a, b); })(12, 8) === 12 );

function getMax(a, b) {
    let result;

    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error('a, b must be a number');
    } else if ( a > b) {
        result = a;
    } else {
        result = b;
    }

    return result;
}

console.log('getMax', getMax(8, 99) === 99 );

function getMaxFromUserInput(defA) {
    let a;

    if (typeof defA === 'undefined') {
        a = prompt('Get first number');

        if ( a === null ) {
            return ;
        } else if ( isNaN(a) ) {
            return getMaxFromUserInput();
        }
    } else {
        a = defA;
    }

    const b = prompt('Get second number');

    if (b === null) {
        return ;
    }

    if ( isNaN(b) ) {
        return getMaxFromUserInput(a);
    }

    return getMax(parseInt(a, 10), parseInt(b, 10));
}

console.log( getMaxFromUserInput() );
