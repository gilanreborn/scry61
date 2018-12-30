import Component from './component.js';
import icon from '../templates/icon.js';
import { html, svg, render } from 'https://unpkg.com/lit-html?module';
import image from './card/image.js';

export default class Results extends Component {
	constructor(options) {
		super(options);
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

	update(props, oldProps) {
		const { imgSize, page, pageSize } = props.results;
		const results = window.cards ? this.applyFilters(props.filters) : [];
		const view = html`
			<div class="results__options">
				Sort:
					<a>Name</a>
					<a>Power</a>
					<a>Toughness</a>
					<a>CMC</a>
				|
					<a>ASC</a>
					<a>DES</a>

				View:
					<a @click=${this.increaseImgSize}>+</a>
					<a @click=${this.decreaseImgSize}>–</a>
			</div>
			<ul class="results__list">
				${results.slice(page * pageSize, (page + 1) * pageSize).map(card => html`
					<li class="results__list-item" style="width: ${imgSize}px">
						${image(card, card.printings[card.printings.length - 1])}
					</li>
				`)}
			</ul>
		`;
		render(view, this.$container);
	}
}