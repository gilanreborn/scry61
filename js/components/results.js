import Component from './component.js';
import icon from '../templates/icon.js';
import { html, svg, render } from 'https://unpkg.com/lit-html?module';
import image from './card/image.js';

export default class Results extends Component {
	constructor(options) {
		super(options);

		this._state = {
			sort: 'name',
			sortDir: 'ASC',
		};
	}

	setSort(value) {
		return e => this.setState({ sort: value });
	}
	setSortDir(value) {
		return e => this.setState({ sortDir: value });
	}

	increaseImgSize(e) {
		window.app.dispatch({ type: 'INCREASE_IMG_SIZE', });
	}

	decreaseImgSize(e) {
		window.app.dispatch({ type: 'DECREASE_IMG_SIZE', });
	}

	applyFilters(filters = {}) {
    const results = Object.entries(filters).reduce((filteredCards, [name, fn]) => {
      return fn ? filteredCards.filter(fn) : filteredCards;
    }, window.cards);

		return results;
	}

	applySorts(cards) {
		const { sort, sortDir } = this._state;
		const dir = sortDir === 'ASC' ? 1 : -1;
		const intParser = (a, b) => {
			const x = isNaN(parseInt(a[sort])) ? -10 : parseInt(a[sort]);
			const y = isNaN(parseInt(b[sort])) ? -10 : parseInt(b[sort]);
			return x < y ? -dir : dir;
		};
		// default to alphabetical sort, remove cards without the desired attribute
		let preSort = cards.sort((a, b) => a.name < b.name ? -1 : 1).filter(a => a[sort] !== undefined);
		let results;
		switch (sort) {
			case 'power': results = preSort.sort(intParser); break;
			case 'toughness': results = preSort.sort(intParser); break;
			default: results = preSort.sort((a, b) => a[sort] < b[sort] ? -dir : dir); break;
		}
		return results;
	}

	buildSortInput({ text, value, active }) {
		return html`
			<a class="${active ? 'active' : ''}" @click=${this.setSort(value).bind(this)}>
				${text}
			</a>
		`;
	}

	buildSortInputs(values) {
		return values.map(this.buildSortInput.bind(this));
	}

	updatePageSize(e) {
		let pgSize = +e.target.value;
		if ( isNaN(pgSize) ) { pgSize = 48; }
		window.app.dispatch({ type: 'SET_PAGE_SIZE', payload: pgSize });
	}

	updatePage(e) {
		let increment = +e.target.value;
		window.app.dispatch({ type: 'INCREMENT_PAGE_NUMBER', payload: increment });
	}

	update(props, oldProps) {
		const { imgSize, page, pageSize } = props.results;
		const { sort, sortDir } = this._state;
		const results = window.cards ? this.applyFilters(props.filters) : [];
		const sortedResults = results.length ? this.applySorts(results) : [];
		const resultCountStart = Math.min(page * pageSize + 1, results.length);
		const resultCountEnd = Math.min((page + 1) * pageSize, results.length);
		const pageCountCurrent = page + 1;
		const pageCountTotal = ~~(results.length / pageSize) + 1;
		const resultsList = sortedResults.slice(page * pageSize, (page + 1) * pageSize).map(card => html`
		<li class="results__list-item" style="width: ${imgSize}px">
			${image(card, card.printings[card.printings.length - 1])}
		</li>
	`);
		const noResults = html`<li class="results__no-results">The specimen seems to be broken</li>`;

		const view = html`
			<div id="results">
				<div class="results__header">
					<div class="results__header__count">
						<span>Results ${resultCountStart} - ${resultCountEnd} of ${results.length}</span>
						<span> | </span>
						<span>
							<input type="number"
								class="results__header__page-size-input"
								@change=${this.updatePageSize.bind(this)}
								.value=${pageSize}
							></input>
							per page
						</span>
					</div>
					<h2 class="results__header__title">Results</h2>
					<div class="results__header__pagination">
						<button class="results__header__pagination__arrow results__header__pagination__arrow--left non-selectable"
							@click=${this.updatePage.bind(this)}
							value="-3"
							?disabled=${page === 0}
						>◄◄</button>
						<button class="results__header__pagination__arrow results__header__pagination__arrow--left non-selectable"
							@click=${this.updatePage.bind(this)}
							value="-1"
							?disabled=${page === 0}
						>◄</button>
						<span class="results__header__pagination__text">
							Page ${pageCountCurrent} of ${pageCountTotal}
						</span>
						<button class="results__header__pagination__arrow results__header__pagination__arrow--right non-selectable"
							@click=${this.updatePage.bind(this)}
							value="1"
							?disabled=${pageCountCurrent >= pageCountTotal}
						>◄</button>
						<button class="results__header__pagination__arrow results__header__pagination__arrow--right non-selectable"
							@click=${this.updatePage.bind(this)}
							value="3"
							?disabled=${pageCountCurrent + 2 >= pageCountTotal}
						>◄◄</button>
					</div>
				</div>
				<div class="results__options">
					Sort:
						${this.buildSortInputs([
							{ text: 'Name', value: 'name', active: sort === 'name' },
							{ text: 'Power', value: 'power', active: sort === 'power' },
							{ text: 'Toughness', value: 'toughness', active: sort === 'toughness' },
							{ text: 'CMC', value: 'convertedManaCost', active: sort === 'convertedManaCost' },
						])}
					|
						${this.buildSortInputs([
							{ text: 'ASC', value: 'ASC', active: sortDir === 'ASC' },
							{ text: 'DES', value: 'DES', active: sortDir === 'DES' },
						])}

					View:
						<a @click=${this.increaseImgSize}>+</a>
						<a @click=${this.decreaseImgSize}>–</a>
				</div>
				<ul class="results__list">
					${resultsList.length ? resultsList : noResults}
				</ul>
			</div>
		`;
		render(view, this.$container);
	}
}