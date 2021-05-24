/**
 * Дан обьект с баллами за задание
*/
const grade = {
    Anton: getRandomBall(0, 90),
    Maksym: 90,
    Vladyslav: getRandomBall(),
    Oleksii: getRandomBall(40),
    Vadim: getRandomBall(40, 70),
    Andrey: getRandomBall(15, 80)
};

function getRandomBall(min = 0, max = 100) {
    return Math.round( min + Math.random() * (max - min) );
}

console.log(grade);

/** Требуется:
 1. Указать имя учащегося с максимальным количеством баллов
 2. Указать максимальный балл.
 3. Указать средний балл.
 4. Указать учащегося с баллом ближайшим к среднему.
 5. Перечислить учащихся с баллом ниже среднего.
 6. Перечислить учащихся занявших первые три места в порядке убывания рейтинга.
*/

function successStudent(grade) {
    let leaderName = '';
    let currentMaxResult = -1;

    for (const studentName in grade) {
        const studentResult = grade[studentName];

        if (currentMaxResult < studentResult) {
            leaderName = studentName;
            currentMaxResult = studentResult;
        }
    }

    return leaderName;
}

console.log( successStudent(grade) );

function getMaxResult(grade) {
    let currentMaxResult = -1;

    for (const studentName in grade) {
        const studentResult = grade[studentName];

        if (currentMaxResult < studentResult) {
            currentMaxResult = studentResult;
        }
    }

    return currentMaxResult;
}

console.log( getMaxResult(grade) );

function getAverageResult(grade) {
    if (typeof grade !== 'object' || grade === null) {
        throw new Error('wrong data');
    }

    let studentsCount = 0;
    let totalSum = 0;

    for (const student in grade) {
        totalSum = totalSum + grade[student];
        studentsCount++;
    }

    return totalSum / studentsCount;
}

console.log( getAverageResult(grade) );

function getAverageStudentName(grade) {
    let stName = '';
    let stResultDiff = Infinity;
    const averageResult = getAverageResult(grade);

    for (const currentStName in grade) {
        const currentResultDiff = Math.abs(grade[currentStName] - averageResult);

        if (currentResultDiff < stResultDiff) {
            stName = currentStName;
            stResultDiff = currentResultDiff;
        }
    }

    return stName;
}

console.log( getAverageStudentName(grade) );

function getStudentsWithResultLessThanAverage(grade) {
    const result = [];
    const averageResult = getAverageResult(grade);

    for (const stName in grade) {
        if (grade[stName] < averageResult) {
            result.push(stName);
        }
    }

    return result;
}

console.log( getStudentsWithResultLessThanAverage(grade) );

// eslint-disable-next-line no-unused-vars
function getTop3Students(grade) {
    const sortedByResult = {
        length: 0
    };
    const result = {};

    for (const stName in grade) {
        sortedByResult[ grade[stName] ] = stName;
        sortedByResult.length = sortedByResult.length + 1;
    }

    let i = 0;

    for (const currentResult in sortedByResult) {
        if (currentResult === 'length') {
            continue ;
        }

        const currentPlace = sortedByResult.length - i;

        i++;

        if (currentPlace <=3) {
            // console.log({
            //     sortedByResult,
            //     currentResult,
            //     currentPlace,
            //     name: sortedByResult[currentResult],
            // });
            result[currentPlace] = sortedByResult[currentResult];
        }
    }

    return result;
}

// eslint-disable-next-line no-unused-vars
function getTop3Students2(grade) {
    const sortedByResult = {
        length: 0
    };

    for (const stName in grade) {
        sortedByResult[ grade[stName] ] = stName;
        sortedByResult.length = sortedByResult.length + 1;
    }

    let orderedStudents = [];

    for (const currentResult in sortedByResult) {
        if (currentResult !== 'length') {
            orderedStudents.push( sortedByResult[currentResult]);
        }
    }

    orderedStudents.reverse();
    orderedStudents.length = 3;

    return orderedStudents;
}

function getTop3Students3(grade) {
    const studentNames = Object.keys( grade );

    studentNames
        .sort(function (stName1, stName2) {
            if (grade[stName1] > grade[stName2]) {
                return -1;
            }

            if (grade[stName1] === grade[stName2]) {
                return 0;
            }

            return 1;
        });

    studentNames.length = 3;

    return studentNames;
}

console.log(grade);
console.log( getTop3Students3(grade) );
