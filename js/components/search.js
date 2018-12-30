import Component from './component.js';
import icon from '../templates/icon.js';
import svgIcon from '../templates/svgs/icon.js';
import searchInput from '../templates/searchInput.js';
import input from '../templates/input.js';
import { html, svg, render } from 'https://unpkg.com/lit-html?module';


export default class Search extends Component {
	constructor(options) {
		super(options);
	}

	buildSearchInput({ legend, clear, classList, onChange, value, placeholder }) {
		return html`
			<fieldset class="search__fieldset">
				<legend class="search__fieldset__legend">${legend}</legend>
				<input type="text"
					class="search__fieldset__input ${classList.toLowerCase()}"
					@change=${onChange}
					@keyup=${e => e.key === 'Enter' && onChange(e)}
					.value="${value}"
					.placeholder=${placeholder || ''}
				>
				<button class="search__input--clear" @click=${clear}>&times;</button>
			</fieldset>
		`
	}

	buildColorPicker(colors, currentColors) {
		const options = colors.map(({color, symbol}) => {
			return { checked: currentColors.includes(color), click: this.updateCardColorField, symbol, value: color };
		});
		return options.map(opt => html`<li>${this.buildCheckbox(opt)}</li>`)
	}

	buildCheckbox({ checked, click, symbol, value }) {
		return html`
			<input type="checkbox" id="${symbol}" name="${symbol}" ?checked=${checked} @click=${click} symbol=${symbol} value=${value}>
			<label class="checkbox__label" for="${symbol}">${icon(symbol)}</label>
		`
	}

	buildSearchRefiner({ type, }, currentRefinement) {
		const options = 'AND OR NOT EXACTLY ONLY EXCLUDE_UNSELECTED'.split(' ');
		const searchRefinements = options.map((opt, idx) => {
			const id = type + opt + idx;
			return html`
				<li>
					<input type="radio"
						id="${id}"
						class="search-refiner__radio__button"
						name="radio-group--${type}"
						?checked=${currentRefinement === opt}
						@click=${this.updateCardColorOptions}
						value=${opt}
					>
					<label class="search-refiner__radio__label" for="${id}">${opt.replace('_', ' ')}</label>
				</li>`
		});
		return html`
			<ul class="search-refiner__list">
				${ searchRefinements }
			</ul>
		`;
	}

	optionsFor(fieldName) {
		const self = this;
		return {
			name: fieldName,
			legend: fieldName,
			onChange: e => self[`updateCard${fieldName}Field`](e),
			classList: `search__fieldset__input--card-${fieldName}`,
			clear: self.clearCard(fieldName),
		}
	}

	updateCardNameField(e) {
		const name = e.target.value.toLowerCase();
		window.app.dispatch({
			type: 'SET_CARD_NAME',
			payload: name,
		});
		window.app.dispatch({
			type: 'ADD_FILTER',
			payload: { byName: card => card.name.toLowerCase().indexOf(name) !== -1, },
		});
	}

	updateCardColorField(e) {
	}
	updateCardColorOptions(e) {
		debugger;
	}

	updateCardTextField(e) {
		const text = e.target.value;
		window.app.dispatch({
			type: 'SET_CARD_TYPE',
			payload: text,
		});
		window.app.dispatch({
			type: 'ADD_FILTER',
			payload: {
				byText: card => text.split(' ').reduce((memo, term) => memo && card.text.toLowerCase().indexOf(term) !== -1, true),
			},
		});
	}

	clearCard(field) {
		return function(e) {
			window.app.dispatch({
				type: 'SET_CARD_' + field.toUpperCase(),
				payload: '',
			});
			window.app.dispatch({
				type: 'REMOVE_FILTER',
				payload: { ['by' + field]: false }
			});
		}
	}

	search(e) {
		e.preventDefault();
	}

	update(props, oldProps) {
		const { cardName, cardText, colors, colorOptions } = props.search;
		const view = html`
			<form id="search" @submit=${this.search}>
				<h2 class="search__header"> SEARCH </h2>
				${this.buildSearchInput({ ...this.optionsFor('Name'), value: cardName })}
				<fieldset class="search__fieldset color-picker">
					<legend>Color</legend>
					<ul class="accordion"
						@keyup="${e => e.key === 'Enter' && e.currentTarget.classList.toggle('open')}"
						tabindex="0"
					>
						<li class="accordion__title"
							@click="${e => e.currentTarget.parentElement.classList.toggle('open')}"
						>
							<ul class="color-picker__list">
								${this.buildColorPicker([
									{ color: 'White', symbol: 'W' },
									{ color: 'Blue', symbol: 'U' },
									{ color: 'Black', symbol: 'B' },
									{ color: 'Red', symbol: 'R' },
									{ color: 'Green', symbol: 'G' },
								], colors)}
							</ul>
							<span class="accordion__arrow">${svgIcon('chevron')}</span>
						</li>
						<li>
							${this.buildSearchRefiner({ type: 'color-picker' }, colorOptions)}
						</li>
					</ul>
				</fieldset>
				<fieldset>
					<legend>Type</legend>
				</fieldset>
				${this.buildSearchInput({ ...this.optionsFor('Text'), value: cardText })}
				<fieldset>
					<legend>CMC:</legend>
					Range
				</fieldset>
				<fieldset>
					<legend>Power:</legend>
					Range
				</fieldset>
				<fieldset>
					<legend>Tough:</legend>
					Range
				</fieldset>
				<fieldsent>
					<legend>Rarity</legend>
				</fieldsent>
				<fieldset>
					<legend>Format:</legend>
					<select>
						<option>Any</option>
						<option>Standard</option>
						<option>Modern</option>
						<option>Legacy</option>
						<option>Vintage</option>
						<option>Commander</option>
					</select>
				</fieldset>
				<fieldset>
					<button>Clear All</button>
				</fieldset>
				<fieldset class='search-fieldset mobile-only'>
					<button>See Results</button>
				</fieldset>
			</form>
		`;
		render(view, this.$container);
	}
}