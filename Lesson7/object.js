/**
 * Напишите код, выполнив задание из каждого пункта отдельной строкой:

    1.  Создайте пустой объект user.
    2.  Добавьте свойство name со значением Alexander.
    3.  Добавьте свойство group со значением fe2402
    4.  Измените значение свойства name на Ilya.
    5.  Удалите свойство name из объекта.
    6.  Создайте копию обьекта user.
    7.  Проверьте, что созданный обьект не пустой.
    8.  Узнайте количество свойств в нем.
    9.  Измените в копии свойство name на Ivan.
    10. Сравните свойства этих двух обьектов и придумайте структуру данных для отображения их разницы.
*/

const ageKey = 'age';
const user = {
    name: {
        first: 'Alexander',
        family: 'Pugachov'
    },
    'working group': 'fe2402',
    [ageKey]: 23, // age: 23
    8: 12
};

console.log( user );
console.log( user.age );
console.log( user.name );
console.log( user.name.family );
console.log( user['working group'] );
console.log( user['age'] );
console.log( user['name']['family'] );
console.log( user.ageKey ); // undefined
console.log( user[ageKey] );
console.log( user[8] );

user['working group'] = 'fe2804';

console.log( user['working group'] );

delete user.name;

console.log( user );

delete user[8];

console.log( user );

const a = {
    value1: 8, // '7'
    value2: 10 // 12
};

console.log( a.value1 + a.value2 ); // 18

const b = a;

b.value2 = 12;

console.log( b.value1 + b.value2 ); // 20

b.value1 = '7';

console.log( a.value1 + a.value2 ); // '712'
// typescript

for (const key in user) {
    console.log( key, user[key] );
}

function getObjLength(obj) {
    let count = 0;

    for (const key in obj) {
        count++; // count = count + 1
    }

    return count;
}

console.log( getObjLength(user) );

function cloneObj(obj) {
    const result = {};

    for (const key in obj) {
        let value = obj[key];

        if (typeof value === 'object') {
            value = cloneObj(value);
        }

        result[key] = value;
    }

    return result;
}

const c = { name: 'c', a };
const d = cloneObj(c);
d.name = 'd';
d.a.value1 = 9;

console.log( d );
console.log( c );
console.log( a );
