/* eslint-disable no-unused-vars */
/** Дана информация о людях ANCESTRY_DATA
 *
 * Используя этот набор данных, подсчитайте:
 *
 * среднюю разницу в возрасте между матерями и их детьми.
 * среднюю разницу между в возрасте между родителями
 * среднее количество детей в семье (in home)
 * средний возраст людей для каждого из столетий.
 * Назначаем столетию людей, беря их год смерти, деля его на 100 и округляя:
 * `Math.ceil(person.died / 100)`.
*/

/* global ANCESTRY_DATA */
console.log( 'ANCESTRY_DATA', ANCESTRY_DATA );

function getAge(human) {
    return human.died - human.born;
}

function getHuman(name) {
    return ANCESTRY_DATA.find(function (human) {
        return human.name === name;
    });
}

function getAgeDiffBetweenMother(human) {
    // human.mother string | null
    if (!human.mother) {
        return null;
    }

    // {} | undefined
    const mother = getHuman(human.mother);

    if (!mother) {
        return null;
    }

    // number | NaN
    const motherAge = getAge(mother);
    const humanAge = getAge(human);

    // true || false => true
    // false || true => true
    // true || true => true
    if (isNaN(motherAge) || isNaN(humanAge)) {
        return null;
    }

    return motherAge - humanAge;
}

function getAgeDiffBetweenFather(human) {
    // human.mother string | null
    if (!human.father) {
        return null;
    }

    // {} | undefined
    const father = getHuman(human.father);

    if (!father) {
        return null;
    }

    // number | NaN
    const fatherAge = getAge(father);
    const humanAge = getAge(human);

    // true || false => true
    // false || true => true
    // true || true => true
    if (isNaN(fatherAge) || isNaN(humanAge)) {
        return null;
    }

    return fatherAge - humanAge;
}

function getAverage(arr) {
    return arr.reduce(
        function (sum, num) {
            return sum + num;
        },
        0
    ) / arr.length;
}

function getAverageAgeDiffBetweenMothersAndChildrens() {
    // number[]
    return getAverage(
        ANCESTRY_DATA
            .map(getAgeDiffBetweenMother)
            .filter(function (ageDiff) {
                // return typeof ageDiff === 'number';
                return ageDiff !== null;
            })
    );
}

console.log(
    'getAverageAgeDiffBetweenMothersAndChildrens',
    getAverageAgeDiffBetweenMothersAndChildrens()
);

function getAverageAgeDiffBetweenFathersAndChildrens() {
    // number[]
    return getAverage(
        ANCESTRY_DATA
            .map(getAgeDiffBetweenFather)
            .filter(function (ageDiff) {
                // return typeof ageDiff === 'number';
                return ageDiff !== null;
            })
    );
}

console.log(
    'getAverageAgeDiffBetweenFathersAndChildrens',
    getAverageAgeDiffBetweenFathersAndChildrens()
);

function getChildren(motherName, fatherName) {
    return ANCESTRY_DATA.filter(function (child) {
        return child.father === fatherName && child.mother === motherName;
    });
}

function getFamily(human) {
    const mother = getHuman(human.mother);
    const father = getHuman(human.father);

    if (!mother && !father) {
        return null;
    }

    const family = {
        id: `${human.mother}+${human.father}`,
        mother,
        father,
        children: getChildren(human.mother, human.father)
    };

    return family;
}

function getAgeDiffBetweenMotherAndFather(human) {
    if (!human.mother || !human.father) {
        return null;
    }

    const mother = getHuman(human.mother);
    const father = getHuman(human.father);

    if (!mother || !father) {
        return null;
    }

    const motherAge = getAge(mother);
    const fatherAge = getAge(father);

    if (isNaN(motherAge) || isNaN(fatherAge)) {
        return null;
    }

    return motherAge - fatherAge;
}

function getAverageAgeDiffBetweenFatherAndMother() {
    const ageDiffs = Object.values(
        ANCESTRY_DATA
            .map(getFamily)
            .reduce(
                function (uniqueFamilies, family) {
                    if ( family !== null && family.father && family.mother) {
                        uniqueFamilies[family.id] = family;
                    }

                    return uniqueFamilies;
                },
                {}
            )
    ).map(function (family) {
        const motherAge = getAge(family.mother);
        const fatherAge = getAge(family.father);

        return fatherAge - motherAge;
    }).filter(function (ageDiff) {
        return !isNaN(ageDiff);
    });

    return getAverage(ageDiffs);
}

console.log(
    'getAverageAgeDiffBetweenFatherAndMother',
    getAverageAgeDiffBetweenFatherAndMother()
);

function getHumanCentury(human) {
    if (!human.died) {
        if (!human.born) {
            return null;
        }

        return Math.ceil(human.born / 100);
    }

    return Math.ceil(human.died / 100);
}

function getAverageAgeByCentury() {
    const centuries = ANCESTRY_DATA
        .reduce(
            function (centuries, human) {
                const humanCentury = getHumanCentury(human);

                if (humanCentury !== null) {
                    if (!centuries[humanCentury]) {
                        centuries[humanCentury] = [];
                    }

                    const humanAge = getAge(human);

                    if (!isNaN(humanAge)) {
                        centuries[humanCentury].push(humanAge);
                    }
                }

                return centuries;
            },
            {}
        );

    for (const century in centuries) {
        centuries[century] = getAverage(centuries[century]);
    }

    return centuries;
}

console.log(
    'getAverageAgeByCentury',
    getAverageAgeByCentury()
);
