import { html, svg, render } from '/node_modules/lit-html/lit-html.js';
import Component from './component.js';
import image from './card/image.js';
import text from './card/text.js';
import textBox from './card/textBox.js';
import titleBox from './card/titleBox.js';

export default class Inspector extends Component {
	constructor(options) {
		super(options)

		this._state = {
			panel: 'image',
			mode: 'compact',
		};
	}

	setPrinting(e) {
		const setCode = e.target.value;
		app.dispatch({
			type: 'INSPECT_PRINTING',
			payload: setCode,
		});
	}

	setPanel(e) {
		this.setState({ panel: e.target.value });
	}

	closeModal() {
		q('.modal')[0] && q('.modal')[0].classList.remove('modal');
	}

	buildRadioGroup(options = [], { type, click }, currentlySelected) {
		const radioButtons = options.map((opt, idx) => {
			const id = type + opt + idx;
			return html`
				<li>
					<input type="radio"
						id="${id}"
						class="inspector__radio__button"
						name="radio-group--${type}"
						.checked=${currentlySelected === opt}
						@click=${click}
						value=${opt}
					>
					<label class="inspector__radio__label" for="${id}">${opt.replace('_', ' ')}</label>
				</li>`
		});
		return html`
			<ul class="inspector__radio-group flex">
				${ radioButtons }
			</ul>
		`;
	}

	update(props) {
		const { card, printing, face } = props.inspector;
		const { panel, mode } = this._state;
		const view = html`
			<section class="inspector flex" data-drop-target="results">
				<div class="inspector__options">
					<form class="inspector__form inspector__form--${mode}">
						<fieldset class="inspector__fieldset">
							<legend>View</legend>
							<h3 class="inspector__fieldset__title">View</h3>
							${this.buildRadioGroup(['image', 'text'], { type: 'panel', click: this.setPanel.bind(this) }, panel)}
						</fieldset>
						<fieldset class="inspector__fieldset">
							<legend>Printing</legend>
							<h3 class="inspector__fieldset__title">Printing</h3>
							<label>
								<select @change="${this.setPrinting}">
									${card.sets.map(set => html`<option value="${set.set}">${set.setName}</option>`)}
								</select>
							</label>
						</fieldset>
					</form>
					<div> related cards:
						${this.buildRadioGroup(
							card.names,
							{
								type: 'panel',
								click: e => app.dispatch({ type: 'INSPECT_CARD', payload: cards.filter(c => c.name === e.target.value)[0] })
							},
							panel
						)}
					</div>
					<div>
						<h5>Rulings:</h5>
						<ul class="inspector__rulings" >
							${(card.rulings || []).map(r => html`<li>${r.text}</li>`)}
						</ul>
					</div>
				</div>
				<div class="inspector__card inspector__card--${panel}">
					${panel === 'image' ? image({ card, printing }) : text({ card, printing })}
				</div>
			</section>
		`;

		render(view, this.$container);
	}
}