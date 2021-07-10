export default class Filter {
    constructor( onFilterChange ) {
        this.root = document.querySelector('.filters');
        this.links = Array.from(this.root.querySelectorAll('a[href]'));
        this.availableValues = this.links.map(l => l.hash);

        let currentValue = location.hash
            && this.availableValues.includes(location.hash) ? location.hash : '';

        if (!currentValue) {
            const activeLink = this.links.find(l => l.classList.contains('selected'));

            if (activeLink && activeLink.hash) {
                currentValue = activeLink.hash;
            } else {
                currentValue = '#/all';
            }
        }

        // this.value = currentValue;
        this.changeFilter(currentValue);

        this.links.forEach(l => l.addEventListener('click', this.changeFilterHandler.bind(this, l)));

        this.onFilterChange = onFilterChange;
    }

    changeFilterHandler(lnk, e) {
        e.preventDefault();

        history.pushState(null, '', lnk.href);

        this.changeFilter(lnk.hash);
    }

    changeFilter(newValue) {
        if (!this.availableValues.includes(newValue)
            && this.value === newValue) {
            return ;
        }

        this.value = newValue;

        this.links.forEach(l => {
            if (l.hash === newValue) {
                l.classList.add('selected');
            } else {
                l.classList.remove('selected');
            }
        });

        if (this.onFilterChange) {
            this.onFilterChange();
        }
    }
}
