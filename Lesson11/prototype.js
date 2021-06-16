const animal = {
    state: {
        eat: 100,
        drink: 100
    },
    eat() { this.state.eat = 100; },
    drink() { this.state.drink = 100; },
    step() {
        this.state.eat = this.state.eat - 1;
        this.state.drink = this.state.drink - 2;
    }
};

const rabbit = {
    state: {
        eat: 100,
        drink: 100
    },
    __proto__: animal
};

rabbit.eat(); //* this = rabbit
rabbit.state.eat;
