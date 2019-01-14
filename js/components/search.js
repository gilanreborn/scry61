import Component from './component.js';
import icon from '../templates/icon.js';
import svgIcon from '../templates/svgs/icon.js';
import searchInput from '../templates/searchInput.js';
import input from '../templates/input.js';
import { html, svg, render } from 'https://unpkg.com/lit-html?module';

export default class Search extends Component {
	constructor(options) {
		super(options);

		this._state = {
			mode: 'comfortable',
		};
	}

	buildSearchInput({ legend, clear, classList, onChange, value, placeholder }) {
		return html`
			<fieldset class="search__fieldset">
				<legend>${legend}</legend>
				<h3 class="search__fieldset__title">${legend}</h3>
				<div class="search__fieldset__group">
					<label class="search__fieldset__label">
						<input type="text"
							class="search__fieldset__input ${classList.toLowerCase()}"
							@change=${onChange}
							@keyup=${e => e.target === this && e.key === 'Enter' && onChange(e)}
							.value="${value}"
							.placeholder=${placeholder || ''}
						>
					</label>
				</div>
				<button type="button"
					class="search__fieldset__clear clear-search-field"
					title="clear"
					@click=${clear}
				>&times;
				</button>
			</fieldset>
		`
	}

	buildPicker(values, currentValue, updateCallback) {
		const options = values.map(({ value, symbol }) => {
			return { checked: currentValue.includes(value), click: updateCallback.bind(this), symbol, value };
		});
		return options.map(opt => html`<li>${this.buildCheckbox(opt)}</li>`);
	}

	buildCheckbox({ checked, click, symbol, value, title }) {
		return html`
			<input type="checkbox" id="${symbol}" name="${symbol}" .checked=${checked} @click=${click} symbol=${symbol} value=${value}>
			<label class="checkbox__label" for="${symbol}" title="${title || value}">${icon(symbol)}</label>
		`
	}

	buildSearchRefiner({ type, click }, currentRefinement) {
		const options = 'AND OR NOT EXACTLY ONLY EXCLUDE_UNSELECTED'.split(' ');
		const searchRefinements = options.map((opt, idx) => {
			const id = type + opt + idx;
			return html`
				<li>
					<input type="radio"
						id="${id}"
						class="search-refiner__radio__button"
						name="radio-group--${type}"
						.checked=${currentRefinement === opt}
						@click=${click}
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

	buildRangeSetter({ name, min, max, callback, clear }) {
		return html`
			<div class="search__fieldset__group">
				<span class="range-setter range-setter--${name}">
					<input type="number"
						class="range-setter__input range-setter__input--min"
						@change=${e => callback({ min: e.target.value, max }, name)}
						.value=${min === max || isNaN(min) ? '' : min }
						placeholder="MIN"
					/>
					<span class="range-setter__divider"> ≤ </span>
					<input type="number"
						class="range-setter__input range-setter__input--mid"
						@change=${e => callback({ min: e.target.value, max: e.target.value }, name)}
						.value=${min !== max || isNaN(max) || isNaN(min) ? '' : max}
						.placeholder=${name.toUpperCase()}
					/>
					<span class="range-setter__divider"> ≤ </span>
					<input type="number"
						class="range-setter__input range-setter__input--max"
						@change=${e => callback({ min, max: e.target.value }, name)}
						.value=${min === max || isNaN(max) ? '' : max}
						placeholder="MAX"
					/>
				</span>
			</div>
			<button type="button"
				class="search__fieldset__clear clear-search-field"
				title="clear"
				@click=${this.clearRange(name)}
			>&times;
			</button>
		`
	}

	optionsFor(fieldName) {
		const self = this;
		return {
			name: fieldName,
			legend: fieldName,
			onChange: e => self[`updateCard${fieldName}Field`](e),
			classList: `search__fieldset__input--card-${fieldName}`,
			clear: self.clearCard(fieldName),
			placeholder: fieldName,
		}
	}

	seeResults(e) {
		window.app.dispatch({ type: 'TOGGLE_PANE', payload: 'results' })
	}

	// UPDATER FUNCTIONS
	updateCardNameField(e) {
		const name = e.target.value.toLowerCase();
		window.app.dispatch({ type: 'SET_CARD_NAME', payload: name, });
		window.app.dispatch({
			type: 'ADD_FILTER',
			payload: { byName: card => card.name.toLowerCase().indexOf(name) !== -1, },
		});
	}

	updateColor(e) {
		const colors = q('.color-picker__list input:checked').map(el => el.value);
		const filterOption = q('[name="radio-group--color-picker"]:checked')[0].value;
		const filterObject = this.abstractedFilterOptions('colors', colors, filterOption);
		window.app.dispatch({ type: 'SET_CARD_COLORS', payload: colors });
		window.app.dispatch({ type: 'SET_CARD_COLOR_OPTIONS', payload: filterOption });
		window.app.dispatch({ type: 'ADD_FILTER', payload: filterObject });
	}

	updateRarity(e) {
		const rarity = q('.rarity-picker__list input:checked').map(el => el.value);
		const filterOption = q('[name="radio-group--rarity-picker"]:checked')[0].value;
		const filterObject = this.abstractedFilterOptions('rarities', rarity, filterOption);
		window.app.dispatch({ type: 'SET_CARD_RARITY', payload: rarity });
		window.app.dispatch({ type: 'SET_CARD_RARITY_OPTIONS', payload: filterOption });
		window.app.dispatch({ type: 'ADD_FILTER', payload: filterObject });
	}

	updateFormat(e) {
		const format = e.target.value.toLowerCase();
		const filterFn = card => card.legalities[format] === 'Legal';
		const byFormat = format === 'format' ? false : filterFn;
		window.app.dispatch({ type: 'SET_CARD_FORMAT', payload: format, });
		window.app.dispatch({ type: 'ADD_FILTER', payload: { byFormat }, })
	}

	updateType(e) {
		const type = q('.type-picker input[type="text"]')[0].value;
		const byType = card => card.type.toLowerCase().indexOf(type) !== -1;
		const supertypes = q('.type-picker__list input:checked').map(el => el.value);
		const filterOption = q('[name="radio-group--type-picker"]:checked')[0].value;
		const filterObject = this.abstractedFilterOptions('types', supertypes, filterOption);
		window.app.dispatch({ type: 'SET_CARD_TYPE', payload: type, });
		window.app.dispatch({ type: 'SET_CARD_SUPERTYPES', payload: supertypes, });
		window.app.dispatch({ type: 'SET_CARD_SUPERTYPE_OPTIONS', payload: filterOption, });
		window.app.dispatch({ type: 'ADD_FILTER', payload: { byType }, });
		window.app.dispatch({ type: 'ADD_FILTER', payload: filterObject });
	}

	updateCardTextField(e) {
		const text = e.target.value;
		const byText = card => text.split(' ').reduce((memo, term) => {
			return memo && card.text.toLowerCase().indexOf(term) !== -1;
		}, true);
		window.app.dispatch({ type: 'SET_CARD_TEXT', payload: text });
		window.app.dispatch({ type: 'ADD_FILTER', payload: { byText }, });
	}

	updateRangeField({ min, max }, abbr) {
		const attr = { pwr: 'power', tgh: 'toughness', cmc: 'convertedManaCost' }[abbr];
    // need to handle input values and filter values slightly differently in case input is empty string
    let [minVal, maxVal] = [parseInt(min), parseInt(max)];
    if ( isNaN(minVal) ) { minVal = -999; }
    if ( isNaN(maxVal) ) { maxVal = 999; }
    let rangeFilter = {};
		rangeFilter[attr] = card => minVal <= card[attr] && card[attr] <= maxVal;

		window.app.dispatch({ type: 'SET_CARD_' + abbr.toUpperCase(), payload: { min, max }});
		window.app.dispatch({ type: 'ADD_FILTER', payload: rangeFilter });
		// dispatch
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

	clearRange(field) {
		return function(e) {
			window.app.dispatch({
				type: 'SET_CARD_' + field.toUpperCase(),
				payload: { min: NaN, max: NaN },
			});
			window.app.dispatch({
				type: 'REMOVE_FILTER',
				payload: { ['by' + field]: false }
			});
		}
	}

	clearAll() {
		window.app.dispatch({ type: 'RESTORE_SEARCH_DEFAULTS' });
		window.app.dispatch({ type: 'RESTORE_FILTER_DEFAULTS' });
	}

	abstractedFilterOptions(filterTarget, filterValue, filterOption) {
		console.log([ filterTarget, filterValue, filterOption ]);
    const filterFuncs = {
      'AND': card => filterValue.reduce((memo, target) => memo && card[filterTarget].includes(target), true),
      'OR': card => filterValue.reduce((memo, target) => memo || card[filterTarget].includes(target), false),
      'NOT': card => filterValue.reduce((memo, target) => memo && !card[filterTarget].includes(target), true),
      'EXACTLY': card => {
        return new Set([
          card[filterTarget].length,
          filterValue.length,
          new Set(card[filterTarget].concat(filterValue)).size
        ]).size === 1;
      },
      'ONLY': card => card[filterTarget].length && card[filterTarget].reduce((memo, color) => memo && filterValue.includes(color), true),
      'EXCLUDE_UNSELECTED': card => card[filterTarget].reduce((memo, color) => memo && filterValue.includes(color), true),
      'ANY': card => true,
      'COLORLESS': card => card[filterTarget].length === 0,
    };
    let filterObj = {};
    filterObj[filterTarget] = filterValue.length ? filterFuncs[filterOption] : filterFuncs['ANY'];
		return filterObj;
  }

	search(e) {
		e.preventDefault();
		e.stopPropagation();
	}

	setView(e) {
		const mode = e.target.value.toLowerCase();
		this.setState({ mode })
	}

	update(props, oldProps) {
		const {
				cardName,
				cardType,
				cardSuperType,
				cardSuperTypeOptions,
				cardText,
				colors,
				colorOptions,
				rarity,
				rarityOptions,
				cmc,
				power,
				toughness,
		} = props.search;
		const { mode } = this._state;

		const view = html`
			<form id="search" @submit=${this.search} class="view--${mode}">
				<div class="search__header">
					<span></span>
					<h2 class="search__header__title"> SEARCH </h2>

					<span class="search__options">
						<label class="search__options__label" for="search__options">&#8942;</label>
						<select id="search__options"
							class="search__options__dropdown"
							@change=${this.setView.bind(this)}
						>
							<option>Comfortable</option>
							<option>Compact</option>
							<option>Minimal</option>
						</select>
					</span>
				</div>

				${this.buildSearchInput({ ...this.optionsFor('Name'), value: cardName })}
				<fieldset class="search__fieldset color-picker">
					<legend>Color</legend>
					<h3 class="search__fieldset__title">Color</h3>
					<ul class="color-picker__list">
						${this.buildPicker('WUBRG'.split('').map(c => ({ value: c, symbol: c })), colors, this.updateColor.bind(this))}
					</ul>
					<div class="expando search__fieldset__more-options">
						<div class="expando-box">
							${this.buildSearchRefiner({ type: 'color-picker', click: this.updateColor.bind(this) }, colorOptions)}
						</div>
						<div class="expando-arrow" @click=${e => e.target.parentElement.classList.toggle('open')}>
							&#9660;
						</div>
					</div>
				</fieldset>
				<fieldset class="search__fieldset type-picker">
					<legend>Type</legend>
					<h3 class="search__fieldset__title">Type</h3>
					<div class="search__fieldset__group">
						<label class="search__fieldset__label">
							<input type="text"
								class="search__fieldset__input"
								@change=${this.updateType.bind(this)}
								.value="${cardType}"
								placeholder="Type"
							>
						</label>
					</div>
					<button type="button"
						class="search__fieldset__clear clear-search-field"
						title="clear"
						@click=${this.clearCard('Type')}
					>&times;
					</button>

					<div class="expando search__fieldset__more-options">
						<div class="expando-box">
							<li>
								<ul class="type-picker__list">
									${this.buildPicker(
										'Artifact Creature Enchantment Land Instant Planeswalker Sorcery'.split(' ').map(t => {
											return { value: t, symbol: t };
										}), cardType, this.updateType.bind(this))}
								</ul>
							</li>
							<li>
								${this.buildSearchRefiner({ type: 'type-picker', click: this.updateType.bind(this) }, cardSuperTypeOptions)}
							</li>
						</div>
						<div class="expando-arrow" @click=${e => e.target.parentElement.classList.toggle('open')}>
							&#9660;
						</div>
					</div>
				</fieldset>
					${this.buildSearchInput({ ...this.optionsFor('Text'), value: cardText })}
				<fieldset class="search__fieldset">
					<legend>CMC</legend>
					<h3 class="search__fieldset__title">CMC</h3>
					${this.buildRangeSetter({ name: 'cmc', min: cmc.min, max: cmc.max, callback: this.updateRangeField })}
				</fieldset>
				<fieldset class="search__fieldset">
					<legend>Power</legend>
					<h3 class="search__fieldset__title">Power</h3>
					${this.buildRangeSetter({ name: 'pwr', min: power.min, max: power.max, callback: this.updateRangeField })}
				</fieldset>
				<fieldset class="search__fieldset">
					<legend>Tough</legend>
					<h3 class="search__fieldset__title">Tough</h3>
					${this.buildRangeSetter({ name: 'tgh', min: toughness.min, max: toughness.max, callback: this.updateRangeField })}
				</fieldset>
				<fieldset class="search__fieldset rarity-picker">
					<legend>Rarity</legend>
					<h3 class="search__fieldset__title">Rarity</h3>
					<ul class="rarity-picker__list">
						${this.buildPicker('common uncommon rare mythic special'.split(' ').map(r => {
							return { value: r, symbol: r };
						}), rarity, this.updateRarity.bind(this))}
					</ul>
					<div class="expando search__fieldset__more-options">
						<div class="expando-box">
							${this.buildSearchRefiner({ type: 'rarity-picker', click: this.updateRarity.bind(this) }, rarityOptions)}
						</div>
						<div class="expando-arrow" @click=${e => e.target.parentElement.classList.toggle('open')}>
							&#9660;
						</div>
					</div>
				</fieldset>
				<fieldset class="search__fieldset">
					<legend>Format:</legend>
					<h3 class="search__fieldset__title">Format</h3>
					<div class="search__fieldset__group">
						<label class="search__fieldset__label">
							<select @change=${this.updateFormat}>
								<option>Format</option>
								<option>1v1</option>
								<option>Commander</option>
								<option>Duel</option>
								<option>Frontier</option>
								<option>Legacy</option>
								<option>Modern</option>
								<option>Pauper</option>
								<option>Penny</option>
								<option>Vintage</option>
							</select>
						</label>
					</div>
				</fieldset>
				<fieldset>
					<button class="search__clear-all"
						type="button"
						@click=${this.clearAll}
					>Clear All</button>
				</fieldset>
				<fieldset>
					<button class="search__see-results"
						type="button"
						@click=${this.seeResults}
					>See Results</button>
				</fieldset>
			</form>
		`;
		render(view, this.$container);
	}
}
