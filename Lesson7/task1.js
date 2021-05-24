/* eslint-disable no-unused-vars */
// 1. Вывести в консоль числа от 1 до n, где n - это произвольное целое число большее 1.
// 2. Вывести в консоль простые числа от 1 до n.
// 3. Вывести в консоль числа кратные k, в диапазоне от 1 до n. => in home (for)
// 4. В первых трех задачах добавить пользователю возможность ввести значения переменных. => in home
// 5. Выводить в консоль простые числа от 1 до n до тех пор, пока пользователь не скажет хватить.

function consoleNumbers(n) {
    for (let i=1; i <= n; i++) {
        console.log(i);
    }
}

function isSimple(n) {
    for (let d = 2; d < n; d++) {
        if (n % d === 0) {
            return false;
        }
    }

    return true;
}

// consoleNumbers( 5 );
// console.log( isSimple(2) ); // true
// console.log( isSimple(3) ); // true
// console.log( isSimple(4) ); // false
// console.log( isSimple(9) ); // false

function consoleSimpleNumbers(n) {
    for (let i=1; i <= n; i++) {
        if (isSimple(i)) {
            console.log(i);
        }
    }
}

// consoleSimpleNumbers( 50 );

function getSimpleNumbers(n) {
    const result = [];

    for (let i=1; i <= n; i++) {
        if (isSimple(i)) {
            result.push(i);
        }
    }

    return result;
}

console.log( getSimpleNumbers( 50 ) );
