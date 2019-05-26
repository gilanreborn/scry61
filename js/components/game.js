import { html, svg, render } from '/node_modules/lit-html/lit-html.js';
import Component from './component.js';
import list from './card/list.js';
import text from './card/text.js';
import textBox from './card/textBox.js';
import titleBox from './card/titleBox.js';

export default class Game extends Component {
	constructor(options) {
		super(options);

		const { deck } = options;
		this.start(deck);
	}

	start(deck) {
		app.dispatch({ type: 'LOAD_DECK', payload: { decklist: deck } });
		app.dispatch({ type: 'SHUFFLE_DECK' });
		app.dispatch({ type: 'START_GAME' });
	}

	shuffle() {
		app.dispatch({ type: 'SHUFFLE_DECK' });
	}

	drawCard(e) {
		app.dispatch({ type: 'DRAW_CARD' });
	}

	restart() {
		app.dispatch({ type: 'RESET_GAME' });
		this.start([ ...app.state.deck.main ]);
	}

	update(props) {
		const { library, hand, battlefield, graveyard } = props.game;

		const lands = battlefield.filter(c => c.types.includes('Land'));
		const notLands = battlefield.filter(c => !c.types.includes('Land'));

		const view = html`
			<div class="game">
				<div class="battlefield droppable" data-drop-target="battlefield">
					${list({ cards: notLands, view: 'image', klass: 'sample-battlefield' })}
						<br>
					${list({ cards: lands, view: 'image', klass: 'sample-battlefield' })}
				</div>
				<div class="hand" data-drop-target="sample-hand">
					${list({ cards: hand, view: 'image', klass: 'sample-hand' })}
				</div>
				<div class="library" @click="${this.drawCard.bind(this)}">
					Deck: ${library.length} <br>
					Hand: ${hand.length}
				</div>
				<div class="actions">
					<a @click="${this.drawCard.bind(this)}">Draw</a>
					<a @click="${this.restart.bind(this)}">Restart</a>
				</div>
				<div class="graveyard droppable" data-drop-target="graveyard">
					${list({ cards: graveyard, view: 'image', klass: 'sample-graveyard' })}
				</div>
			</div>
		`;

		render(view, this.$container);
	}
}