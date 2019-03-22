import Component from './component.js';
import icon from '../templates/icon.js';
import { html, svg, render } from 'https://unpkg.com/lit-html?module';
import image from './card/image.js';
import text from './card/text.js';
import titleBox from './card/titleBox.js';
import expando from './expando.js';
import pagination from './pagination.js';

export default class Deck extends Component {
	constructor(options) {
		super(options);
	}

	buildDeckObj(cardList = []) {
		const cardTypes = 'Artifact Creature Enchantment Instant Land Sorcery Planeswalker Plane Vanguard Scheme'.split(' ');
		let deck = cardTypes.reduce((acc, item) => {
			acc[item] = [];
			return acc;
		}, {});

		cardList.forEach((card, i) => {
			cardTypes.some((type, i) => {
				if ( card.types.includes(type) ) {
					return deck[type].push(card);
				}

				return false;
			})
		});

		return deck || {};
	}

	buildCardList({ cards, location }) {
		const cardCount = cards.reduce((acc, card) => {
			acc[card.name] = acc[card.name] || 0;
			acc[card.name] += 1;
			return acc;
		}, {});

		const byName = (a, b) => a.name < b.name ? -1 : 1;
		const unique = (card, idx, self) => self.findIndex(c => c.name === card.name) === idx;

		return cards.sort(byName)
			.filter(unique)
			.map(card => this.buildDeckListItem({ card, count: cardCount[card.name] }));
	}

	buildDeckListItem({ card, count }) {
		return html`
			<li class="deck__list__item">
				<span class="card__count">
					${count}
				</span>
				<span class="card card__wrapper">
					${text({ card, collapsed: true })}
				</span>
			</li>
		`;
	}

	buildDeckList({ deckObj }) {
		const deckList = Object.keys(deckObj).sort().map(cardType => {
			const cards = deckObj[cardType];
			if ( !cards.length ) { return }; // no cards of the given type
			return html`
				<li class="deck__list__category flex--col">
					<span class="deck__list__category__title"
						@click=${e => e.currentTarget.classList.toggle('collapsed')}
					>
						<span>${cardType}</span>
						<span>(${cards.length})</span>
					</span>
					<ul class="deck__list__category__list">
						${this.buildCardList({ cards })}
					</ul>
				</li>
			`;
		});
		return deckList;
	}

	setDeckTitle(e) {
		const payload = e.target.value;
		app.dispatch({
			type: 'SET_DECK_TITLE',
			payload,
		});
	}

	newDeck(e) {
		app.dispatch({ type: 'MAKE_NEW_DECK' });
	}

	saveDeck(e) {
		const { deck } = app.state;
		const Scry61 = window.localStorage;
		// const deckList = {
		// 	id: deck.id,
		// 	title: deck.title,
		// 	main: deck.main.reduce((acc, card) => {
		// 		acc[card.name] = acc[card.name] || 0;
		// 		acc[card.name] += 1;
		// 		return acc;
		// 	}, {}),
		// 	side: deck.side.reduce((acc, card) => {
		// 		acc[card.name] = acc[card.name] || 0;
		// 		acc[card.name] += 1;
		// 		return acc;
		// 	}, {}),
		// };

		// debugger;
		if (deck.title) {
			const Scry61 = window.localStorage;
			Scry61.setItem(deck.id, JSON.stringify(deck));
		} else {
			alert('Please name your deck.');
		}
	}

	loadDeck(e) {
		const Scry61 = window.localStorage;
		const deckIds = Object.keys(Scry61);
		const decks = deckIds.map(k => JSON.parse(Scry61[k]));
		app.dispatch({
			type: 'SET_MODAL_CONTENT',
			payload: {
				content: decks.map(deck => html`
					<li class="deck__import__li"
						@click="${this.importDeck}"
						data-title="${deck.title}"
						data-id="${deck.id}"
					>
						${deck.title}
					</li>
				`),
				title: 'Load A Deck',
			},
		});
		app.dispatch({ type: 'SHOW_MODAL' });
	}

	importDeck(e) {
		const deckId = e.target.dataset.id;
		const json = window.localStorage[deckId];
		const deck = JSON.parse(json);

		app.dispatch({
			type: 'IMPORT_DECKLIST',
			payload: deck,
		});

		app.dispatch({ type: 'HIDE_MODAL' });
	}

	update(props, oldProps) {
		const { main, side, title } = props.deck;
		const deckObj = this.buildDeckObj(main);
		const sideObj = this.buildDeckObj(side);
		const mainList = this.buildDeckList({ deckObj });
		const sideList = this.buildDeckList({ deckObj: sideObj });

		const view = html`
			<div class="deck__header">
				<h2 class="deck__header__title">Deck</h2>
			</div>
			${expando({
					klass: 'deck__header__options',
					contents: html`
					<div class="deck__options">
						<input @change="${this.setDeckTitle.bind(this)}" type="text" value="${title}" default="untitled" placeholder="Deck Title">
						<div class="deck__options__save flex">
							<a @click="${this.newDeck.bind(this)}">New</a>
							<a @click="${this.saveDeck.bind(this)}">Save</a>
							<a @click="${this.loadDeck.bind(this)}">Load</a>
						</div>
					</div>
					`,
				})}
			<div class="deck__list flex--col scrollable">
				<div class="deck__list--main droppable"
					data-drop-target="main"
				>
					<span @click=${e => e.currentTarget.classList.toggle('collapsed')}>
						<strong>MAIN</strong> <span>(${main.length && main.length})</span>
					</span>
					<ul class="deck__list__main">
						${mainList}
					</ul>
				</div>
				<div class="deck__list--side droppable"
					data-drop-target="side"
				>
					<span @click=${e => e.currentTarget.classList.toggle('collapsed')}>
						<strong>SIDE</strong> <span>(${side.length && side.length})</span>
					</span>
					<ul class="deck__list__side">
						${sideList}
					</ul>
				</div>
			</div>
			<div class="deck__footer"></div>
		`;

		render(view, this.$container);
	}
}
