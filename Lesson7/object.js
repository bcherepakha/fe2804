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

const groupKey = 'group';

const user = {
    name: 'Alexander',
    // group: 'fe2402',
    [groupKey]: 'fe2402'
};

console.log( user['name'] );
console.log( user[groupKey] );
console.log( user.groupKey );

user['name'] = 'Ilya';

console.log( user['name'] );

user[groupKey] = 'fe0224';

console.log( user.group );

user.name = 'Darina';

console.log( user['name'] );

user.groupKey = 'groupKey';

console.log( user.groupKey );
console.log( user[groupKey] );

delete user.groupKey;
delete user[groupKey];

console.log( user.groupKey );
console.log( 'groupKey' in user );
console.log( 'name' in user );
console.log( groupKey in user );

user.group = 'fe2402';

const user1 = {
    name: 'Vitalik',
    // group: user.group
};

user1.group = user.group;

console.log( user );
console.log( user1 ); // [object Object]

const cloneUser = clone(user);

console.log( cloneUser );

cloneUser.name = 'Anatoliy';

console.log( cloneUser );
console.log( user );

function clone(obj) {
    const result = {};

    for (const key in obj) {
        result[key] = obj[key];
    }

    return result;
}

function objLength(obj) {
    let counter = 0;

    for (const key in obj) {
        counter++;
    }

    return counter;
}

console.log( objLength(user) );
console.log( objLength({}) );

function isEmpty(obj) {
    // return objLength(obj) === 0;

    for (const key in obj) {
        return false;
    }

    return true;
}

console.log( isEmpty(user) );
console.log( isEmpty({}) );

const osArr = ['apple', 'windows', 'linux'];

console.log( osArr[0] );
console.log( osArr[1] );
console.log( osArr[2] );
console.log( osArr.length );
