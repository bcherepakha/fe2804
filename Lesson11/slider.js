function Slider(selector, loop = true, effect) {
    // this = {}
    // this.__proto__ = Slider.prototype

    this.props = {
        selector,
        loop,
        effect
    };

    this.state = {
        currentSlide: 0
    };

    this.rootEl = document.querySelector(selector);

    if (!this.props.effect || !Slider.effects.includes(this.props.effect)) {
        //* this, arguments
        const htmlEffect = Slider.effects.find(
            name => this.rootEl.classList.contains(name)
        );

        if (htmlEffect) {
            this.props.effect = htmlEffect;
        } else {
            this.props.effect = Slider.effects[0];
        }
    }

    this.bodyEl = this.rootEl.querySelector('.slider__body');
    this.slideCollection = this.bodyEl.querySelectorAll('.slider__slide');
    this.prevBtn = this.rootEl.querySelector('.slider__prev');
    this.nextBtn = this.rootEl.querySelector('.slider__next');
    this.timelineEl = this.rootEl.querySelector('.slider__timeline');

    if (this.prevBtn) {
        this.prevBtn.addEventListener('click', this.prevSlide.bind(this));

        //* addEventListener(eventName, callback) {
        //* callback.call(target, event)
        //* }
    }

    if (this.nextBtn) {
        this.nextBtn.addEventListener('click', this.nextSlide.bind(this));
    }

    if (this.props.effect) {
        this.render = this[`render${this.props.effect[0].toUpperCase()}${this.props.effect.slice(1)}`];
    }

    // return this;
}

Slider.effects = ['slide', 'fade'];

// Slider.prototype = { constructor: Slider }
Slider.prototype.renderFade = function() {
    const { currentSlide } = this.state;
    const currentSlideEl = this.slideCollection[currentSlide];
    const showSlideEL = this.bodyEl.querySelector('.slider__current');

    if (showSlideEL !== currentSlideEl) {
        if (showSlideEL) {
            showSlideEL.classList.remove('slider__current');
        }

        currentSlideEl.classList.add('slider__current');
    }
};
Slider.prototype.renderSlide = function() {
    const { currentSlide } = this.state;

    this.bodyEl.style.transform = `translateX(${-currentSlide * 100}%)`;
};
Slider.prototype.nextSlide = function() {
    this.showSlide(this.state.currentSlide + 1);
};
Slider.prototype.prevSlide = function() {
    this.showSlide(this.state.currentSlide - 1);
};
Slider.prototype.showSlide = function(slideIdx) {
    const slideCount = this.slideCollection.length;
    const { loop } = this.props; // loop = this.props.loop

    if ( loop ) {
        slideIdx = slideIdx % slideCount;

        if (slideIdx < 0) {
            slideIdx = slideCount - slideIdx;
        }
    } else {
        slideIdx = Math.max(0, Math.min(slideCount - 1, slideIdx));
    }

    this.state = {
        currentSlide: slideIdx
    };

    this.render();
};

const fadeSlider = new Slider('.slider.fade', true, 'fode');

console.log( fadeSlider );

fadeSlider.showSlide(8); //* this = fadeSlider

const slideSlider = new Slider('.slider.slide', false);

console.log( slideSlider );

slideSlider.showSlide(9); //* this = slideSlider
