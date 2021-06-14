const animal = {
    state: {
        eat: 100,
        drink: 100
    },
    eat() {},
    drink() {},
};

const rabbit = {
    state: {
        eat: 100,
        drink: 100
    },
    __proto__: animal
};

rabbit.eat();
rabbit.state.eat;
