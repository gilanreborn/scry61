import Component from './component.js';
import icon from '../templates/icon.js';
import { html, svg, render } from 'https://unpkg.com/lit-html?module';
import image from './card/image.js';
import text from './card/text.js';
import expando from './expando.js';
import pagination from './pagination.js';

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
	changeSort(e) {
		this.setState({ sort: e.target.value })
	}

	increaseImgSize(e) {
		window.app.dispatch({ type: 'INCREASE_IMG_SIZE', });
	}

	decreaseImgSize(e) {
		window.app.dispatch({ type: 'DECREASE_IMG_SIZE', });
	}

	setCardView(value) {
		return e => window.app.dispatch({ type: 'SET_CARD_VIEW', payload: value });
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

	buildSortInput({ text, value, active, type }) {
		return html`
			<a class="${active ? 'active' : ''}"
				tabindex="0"
				@click=${type === 'sort' ? this.setSort(value).bind(this) : this.setSortDir(value).bind(this)}
			>
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
		const { imgSize, page, pageSize, cardView } = props.results;
		const { sort, sortDir } = this._state;
		const results = window.cards ? this.applyFilters(props.filters) : [];
		const sortedResults = results.length ? this.applySorts(results) : [];
		const resultCountStart = Math.min(page * pageSize + 1, results.length);
		const resultCountEnd = Math.min((page + 1) * pageSize, results.length);
		const pageCountCurrent = page + 1;
		const pageCountTotal = ~~(results.length / pageSize) + 1;

		const modes = {
			image: (card, printing) => image({ card, printing }),
			text: (card, printing) => text({ card, printing }),
		};

		const resultsList = sortedResults.slice(page * pageSize, (page + 1) * pageSize).map(card => html`
			<li class="results__list-item card__container card-view--${cardView}" style="width: ${imgSize}px">
				${modes[cardView](card, card.printings[0])}
			</li>
		`);
		const noResults = html`<li class="results__no-results">The specimen seems to be broken</li>`;

		const view = html`
			<div id="results" data-drop-target="results">
				<div class="results__header">
					<div class="results__header__count">
						<span>${resultCountStart} - ${resultCountEnd} of ${results.length}</span>
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
						${pagination({ page, pageCountCurrent, pageCountTotal, callback: this.updatePage.bind(this), klass: 'head' })}
					</div>
				</div>
				${expando({
					klass: 'results__options__container',
					contents: html`
					<div class="results__options non-selectable">
						<fieldset class="results__fieldset results__options__sorts">
							<h3 class="results__fieldset__title">Sort:</h3>
							<div class="results__options__sorts__dropdown">
								<select @change=${this.changeSort.bind(this)}>
									<option value="name">Name</option>
									<option value="power">Power</option>
									<option value="toughness">Toughness</option>
									<option value="convertedManaCost">CMC</option>
									<option value="loyalty">Loyalty</option>
								</select>
							</div>
						</fieldset>
						<span class="results__options__spacer"> | </span>
						<fieldset class="results__fieldset results__options__dirs">
							<h3 class="results__fieldset__title">Dir:</h3>
							${this.buildSortInputs([
								{ text: 'ASC', value: 'ASC', active: sortDir === 'ASC' },
								{ text: 'DES', value: 'DES', active: sortDir === 'DES' },
							])}
						</fieldset>
						<span class="results__options__spacer"> | </span>
						<fieldset class="results__fieldset results__options__views">
							<h3 class="results__fieldset__title">View:</h3>
								<a class="${cardView === 'text' ? 'active' : ''}"
									@click=${this.setCardView('text').bind(this)}
								>Text</a>
								<a class="${cardView === 'image' ? 'active' : ''}"
									@click=${this.setCardView('image').bind(this)}
								>Img</a>
								<a @click=${this.increaseImgSize}>+</a>
								<a @click=${this.decreaseImgSize}>–</a>
							</fieldset>
					</div>`
				})}
				<ul class="results__list" style="font-size: ${imgSize / 12}px">
					${resultsList.length ? resultsList : noResults}
				</ul>
				<div class="results__footer">
					<div class="results__footer__pagination">
					${pagination({ page, pageCountCurrent, pageCountTotal, callback: this.updatePage.bind(this), klass: 'footer' })}
					</div>
				</div>
			</div>
			<div class="deck__peeker">
				<div class="deck__peeker-item droppable" data-drop-target="main">MAIN</div>
				<div class="deck__peeker-item droppable" data-drop-target="side">SIDE</div>
				<div class="deck__peeker-item droppable" data-drop-target="remove">REMOVE</div>
			</div>
		`;
		render(view, this.$container);
	}
}