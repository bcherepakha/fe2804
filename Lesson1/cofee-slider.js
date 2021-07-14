class Slider {
    constructor({ selector, items = [], createItem }) {
        this.rootEl = document.querySelector(selector);
        this.leftShift = 0;

        this.fill(items, createItem);
        this.render();
    }

    getRightBoard() {
        const { width: rootWidth, x, left } = this.rootEl.getBoundingClientRect();
        const rightBoard = (x || left) + rootWidth;

        return rightBoard;
    }

    render() {
        this.sliderBody.style.transform = `translateX(${this.leftShift}px)`;

        const rightBoard = this.getRightBoard();

        this.itemsColl.forEach(el => {
            const { width, x, left } = el.getBoundingClientRect();
            const shiftLeft = x || left;
            const isVisible = shiftLeft < rightBoard;
            const isPartialVisible = shiftLeft + width > rightBoard;

            el.dataset.visible = isVisible;
            el.dataset.partialVisible = isVisible && isPartialVisible;
        });
    }

    slide(direction) {
        const visibleItems = this.itemsColl.filter(el => el.dataset.visible === 'true');
        const lastVisibleItem = visibleItems[visibleItems.length - 1];
        const { width, x, left } = lastVisibleItem.getBoundingClientRect();

        console.log( direction, this.leftShift, this.leftShift + width);

        switch (direction) {
        case 'left': {
            const islast = lastVisibleItem === this.itemsColl[this.itemsColl.length - 1];
            const isPartialVisible = lastVisibleItem.dataset.partialVisible === 'true';

            console.log( lastVisibleItem, islast, isPartialVisible );

            if (islast && isPartialVisible) {
                const rightBoard = this.getRightBoard();

                console.log({ rightBoard, x, left, width });

                this.leftShift -= rightBoard - (x || left);
            } else if (!islast) {
                this.leftShift -= width;
            }
            break;
        }
        default:
            this.leftShift = Math.min(0, this.leftShift + width);
        }

        console.log( this.leftShift );

        this.render();
    }

    fill(items, createItem) {
        const sliderBody = document.createElement('div');
        const itemsColl = items.map(createItem);
        const slideLeftBtn = document.createElement('button');
        const slideRightBtn = document.createElement('button');

        slideRightBtn.addEventListener('click', this.slide.bind(this, 'right'));
        slideLeftBtn.addEventListener('click', this.slide.bind(this, 'left'));

        sliderBody.className = 'slider__body';
        slideRightBtn.className = 'slider__right';
        slideLeftBtn.className = 'slider__left';

        slideRightBtn.innerText = 'right';
        slideLeftBtn.innerText = 'left';

        itemsColl.forEach(el => el.classList.add('slider__item'));

        sliderBody.append(...itemsColl);
        this.rootEl.append(sliderBody, slideLeftBtn, slideRightBtn);

        this.sliderBody = sliderBody;
        this.itemsColl = itemsColl;
    }
}

const slider = new Slider({
    selector: '.cards',
    items: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    createItem(item) {
        const el = document.createElement('div');
        const { title = 'hello' } = item;
        const titleEl = document.createElement('div');

        el.append(titleEl);
        titleEl.innerText = title;

        el.className = 'card';
        titleEl.className = 'card__title';

        return el;
    }
});

console.log(slider);
