export default class Pagination {
    constructor(rootEl) {
        this.rootEl = rootEl;
    }

    get page() {
        const params = new URLSearchParams(location.search.slice(1));

        return parseInt(params.get('page'), 10) || 1;
    }

    get limit() {
        const params = decodeURI(location.search.slice(1)).split('&')
            .reduce(
                (store, paramStr) => {
                    const [name, value] = paramStr.split('=');

                    store[name] = value;

                    return store;
                }, {}
            );

        return parseInt(params.limit) || 10;
    }

    createLink(page, limit, text) {
        const el = document.createElement('a');

        el.innerText = text || page;

        if (page && limit) {
            el.href = `?page=${page}&limit=${limit}${location.hash}`;
        }

        el.addEventListener('click', this.onClick.bind(this));

        return el;
    }

    onClick(e) {
        e.preventDefault();

        history.pushState(null, '', e.currentTarget.href);

        if (this.onChange) {
            return this.onChange();
        }
    }

    render() {
        const { page, limit } = this;
        const links = [];

        if (page > 1) {
            links.push(
                this.createLink(page - 1, limit, 'Previous page')
            );
        }

        for (let p=1; p < page; p++) {
            links.push(
                this.createLink(p, limit)
            );
        }

        links.push(
            this.createLink(null, null, page)
        );

        links.push(
            this.createLink(page + 1, limit, 'Next page')
        );

        this.rootEl.innerText = '';
        this.rootEl.append(...links);
    }
}

// const o = {
//     a: 1,
//     b: 2,
//     get sum() {
//         return this.a + this.b;
//     },
//     set sum(value) {
//         this.b = value - this.a;
//     }
// };
