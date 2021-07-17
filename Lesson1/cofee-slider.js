class Slider {
    constructor({ selector, loop = false, items = [], createItem }) {
        this.rootEl = document.querySelector(selector);
        this.leftShift = 0;
        this.loop = loop;

        this.fill(items, createItem);
        this.calcOptions();
        this.render();
    }

    getRightBoard() {
        if (this._rightBoard) {
            return this._rightBoard;
        }

        const { width: rootWidth, x, left } = this.rootEl.getBoundingClientRect();
        const rightBoard = (x || left) + rootWidth;

        this._rightBoard = rightBoard;

        return rightBoard;
    }

    getLeftBoard() {
        if (this._leftBoard) {
            return this._leftBoard;
        }

        const { x, left } = this.rootEl.getBoundingClientRect();
        const leftBoard = (x || left);

        this._leftBoard = leftBoard;

        return leftBoard;
    }

    calcOptions() {
        this.itemsColl.forEach(el => {
            const { width, x, left } = el.getBoundingClientRect();
            const shiftLeft = x || left;

            el.dataset.width = width;
            el.dataset.shiftLeft = shiftLeft;
            el.dataset.shiftRight = shiftLeft + width;
        });

        const firstItem = this.itemsColl[0];
        const lastItem = this.itemsColl[this.itemsColl.length - 1];
        const marginLeft = parseInt(window.getComputedStyle(lastItem).getPropertyValue('margin-left'), 10);
        const rightBoard = parseInt(lastItem.dataset.shiftRight, 10);
        const leftBoard = parseInt(firstItem.dataset.shiftLeft, 10);

        this._circularShift = rightBoard - leftBoard;
        this._marginLeft = marginLeft;
    }

    render() {
        this.sliderBody.style.transform = `translateX(${this.leftShift}px)`;

        const rightBoard = this.getRightBoard();
        const leftBoard = this.getLeftBoard();

        this.itemsColl.forEach(el => {
            const {shiftLeft, shiftRight, width, currentShift = '0'} = el.dataset;
            const elShift = parseFloat(currentShift);
            const elWidth = parseFloat(width);
            const elLeftBoard = elShift + parseFloat(shiftLeft) + this.leftShift;
            const elRightBoard = elShift + parseFloat(shiftRight) + this.leftShift;
            const isVisible = elLeftBoard < rightBoard && elRightBoard > leftBoard;
            const isPartialVisible = elRightBoard > rightBoard;
            const isPartialHideLeft = isVisible && elLeftBoard < leftBoard;

            el.dataset.visible = isVisible;
            el.dataset.partialVisible = isVisible && isPartialVisible;
            el.dataset.partialHideLeft = isPartialHideLeft;

            if (this.loop && this._circularShift && !isVisible && elRightBoard < leftBoard - 2*elWidth) {
                const iteration = Math.floor(Math.abs(parseFloat(shiftLeft) + this.leftShift) / this._circularShift) + 1;
                const shift = iteration * (this._circularShift + this._marginLeft);

                el.dataset.iteration = iteration;
                el.dataset.currentShift = shift;
                el.style.transform = `translateX(${shift}px)`;
            }
        });
    }

    slide(direction) {
        const visibleItems = this.itemsColl.filter(el => el.dataset.visible === 'true');
        const lastVisibleItem = visibleItems[visibleItems.length - 1];
        const {shiftRight, width} = lastVisibleItem.dataset;
        const elWidth = parseFloat(width);
        const elRightBoard = parseFloat(shiftRight) + this.leftShift;

        switch (direction) {
        case 'left': {
            const islast = lastVisibleItem === this.itemsColl[this.itemsColl.length - 1];
            const isPartialVisible = lastVisibleItem.dataset.partialVisible === 'true';

            if (!this.loop && islast && isPartialVisible) {
                const rightBoard = this.getRightBoard();

                this.leftShift -= elRightBoard - rightBoard;
            } else if (this.loop || !islast) {
                this.leftShift -= elWidth;
            }
            break;
        }
        default:
            this.leftShift = Math.min(0, this.leftShift + elWidth);
        }

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

        // sliderBody.addEventListener('transitionend', this.calcOptions.bind(this));

        this.sliderBody = sliderBody;
        this.itemsColl = itemsColl;
    }
}

const slider = new Slider({
    selector: '.cards',
    items: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    loop: true,
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
