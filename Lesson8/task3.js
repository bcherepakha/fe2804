// Начальник цеха пригласил людей на совещание
// Каждый, кто входит в кабинет пожимает руки всем присутствующим
// Сколько человек зашло в кабинет, если известно, что всего произошло 120 рукопожатий.

function getPeople(handshake) {
    let currentHandshake = 0;
    let peopleNumber = 0;

    while (currentHandshake < handshake) {
        peopleNumber++;
        currentHandshake += peopleNumber;
    }

    if (currentHandshake !== handshake) {
        throw new Error('wrong data');
    }

    return peopleNumber;
}

console.log( getPeople(1) ); // 1
console.log( getPeople(3) ); // 2
console.log( getPeople(6) ); // 3
console.log( getPeople(10) ); // 4
console.log( getPeople(15) ); // 5
console.log( getPeople(120) ); // ?
