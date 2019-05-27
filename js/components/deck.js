import { html, svg, render } from '/node_modules/lit-html/lit-html.js';
import Component from './component.js';
import Game from './game.js';
import icon from '../templates/icon.js';
import image from './card/image.js';
import text from './card/text.js';
import titleBox from './card/titleBox.js';
import expando from './expando.js';
import pagination from './pagination.js';
import list from './card/list.js';

export default class Deck extends Component {
	constructor(options) {
		super(options);
	}

	autoDetectFormat() {
		return 'modern';
	}

	autoPopulateManabase() {
		let { main, side } = app.state.deck;
		let format = this.autoDetectFormat();
		let colorPie = main.reduce((pie, card) => {
			card.manaCost && card.manaCost.split(/{|}/g).filter(m => m.length).map(m => {
				let wt = m.includes('/') ? .5 : 1;
				m.split('').filter(s => 'WUBRG'.includes(s)).map(x => pie[x] = (pie[x] ? pie[x] : 0) + wt);
			});
			return pie;
		}, { W: 0, U: 0, B: 0, R: 0, G: 0 });
		const cardScore = card => 'WUBRG'.split('').reduce((acc, color) => {
			const add = card.colorIdentity.includes(color) ? 1 : -1;
			const basics = { W: 'Plains', U: 'Island', B: 'Swamp', R: 'Mountain', G: 'Forest' };
			const basic = card.subtypes.includes(basics[color]) ? 1.5 : 1;
			const rarity = { mythic: 2.5, rare: 1.5, uncommon: 1, common: 1, basic: 3 }[card.rarity];
			return acc + colorPie[color] * add * basic * rarity;
		}, 0);
		const suggestions = cards
			.filter(card => card.type.includes('Land') && card.legalities[format] == 'Legal')
			.sort((a, b) => cardScore(a) < cardScore(b) ? 1 : -1)
			.slice(0, 20);

		app.dispatch({
			type: 'SET_MODAL_CONTENT',
			payload: {
				content: html`
					<div class="suggested-lands" data-drop-target="results">
						<div>${JSON.stringify(colorPie)}</div>
						${list({ cards: suggestions })}
					</div>
				`,
				title: 'Suggested Lands',
			},
		});
		q('#modal')[0].classList.add('modal');
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
			.map(card => this.buildDeckListItem({ card, count: cardCount[card.name], location }));
	}

	buildDeckListItem({ card, count, location }) {
		return html`
			<li class="deck__list__item">
				<span class="card__count">
					${count}
					<div class="card__count__controls">
						<a class="card__count__controls--increment" @click=${e => this.incrementCount(card, location)}>+</a><br>
						<a class="card__count__controls--decrement" @click=${e => this.decrementCount(card, location)}>&ndash;</a>
					</div>
				</span>
				<span class="card card__wrapper">
					${text({ card, collapsed: true })}
				</span>
			</li>
		`;
	}

	buildDeckList({ deckObj, location }) {
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
						${this.buildCardList.bind(this)({ cards, location })}
					</ul>
				</li>
			`;
		});
		return deckList;
	}

	compressDeckList(cards = []) {
		return cards.reduce((acc, card) => {
			acc[card.name] = acc[card.name] || 0;
			acc[card.name] += 1;
			return acc;
		}, {});
	}

	decompressDeckList(listObj) {
		const cardNames = Object.keys(listObj);
		return cardNames.reduce((acc, name, idx) => {
			const card = window.cards.filter(c => c.name === name)[0];
			let count = listObj[name];
			while (count > 0) {
				acc.push(card);
				count--;
			}
			return acc;
		}, []);
	}

	drawSampleHand(e) {
		const deck = [...app.state.deck.main];
		q('#game')[0].classList.add('modal');
		const game = new Game({ $container: q('#game')[0], deck });
		game.update(app.state);
		app.subscribe([game]);
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
		const { id, title, main, side } = deck;
		const Scry61 = window.localStorage;
		if (deck.title) {
			const compressedList = {
				id,
				title,
				main: this.compressDeckList(main),
				side: this.compressDeckList(side),
			};
			Scry61.setItem(deck.id, JSON.stringify(compressedList));
		} else {
			alert('Please name your deck.');
		}
	}

	loadDeck(e) {
		const Scry61 = window.localStorage;
		const deckIds = Object.keys(Scry61).filter(k => k !== 'preferences');
		const decks = deckIds.map(k => JSON.parse(Scry61[k]));
		const title = 'Load A Deck';
		const content = html`
			<ul class="deck__import__ul">
				${decks.map(deck => html`
					<li class="deck__import__li"
						@click="${this.importDeck.bind(this)}"
						data-title="${deck.title}"
						data-id="${deck.id}"
					>
						${deck.title}
					</li>
				`)}
			</ul>
		`;

		app.dispatch({ type: 'SET_MODAL_CONTENT', payload: { content, title } });
		q('#modal')[0].classList.add('modal');
	}

	importDeck(e) {
		const deckId = e.target.dataset.id;
		const json = window.localStorage[deckId];
		const { id, title, main, side } = JSON.parse(json);

		const deck = {
			id,
			title,
			main: this.decompressDeckList(main),
			side: this.decompressDeckList(side),
		};

		app.dispatch({ type: 'IMPORT_DECKLIST', payload: deck, });
	}

	incrementCount(card, location) {
		app.dispatch({ type: 'ADD_CARD_TO_' + location.toUpperCase(), payload: card });
	}

	decrementCount(card, location) {
		app.dispatch({ type: 'REMOVE_CARD_FROM_' + location.toUpperCase(), payload: card });
	}

	quickAdd(e) {
		const matches = cards.filter(c => c.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1)
			.sort((a, b) => a.name.length > b.name.length ? 1 : -1);
		app.dispatch({ type: 'QUICK_ADD', payload: e.target.value ? matches : [] });
		if ( e.target.value ) {
			q('.deck__quick-add')[0].classList.add('modal');
		}
	}

	quickAddClose(e) {
		app.dispatch({ type: 'QUICK_ADD', payload: [] });
	}

	update(props, oldProps) {
		const { id, main, side, title, quickAdd } = props.deck;
		const deckObj = this.buildDeckObj(main);
		const sideObj = this.buildDeckObj(side);
		const mainList = this.buildDeckList({ deckObj, location: 'main' });
		const sideList = this.buildDeckList({ deckObj: sideObj, location: 'side' });

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
						<div class="deck__options__advanced flex">
							<a @click="${this.autoPopulateManabase.bind(this)}" title="Generate Lands">Scapeshift</a>
							<a @click="${this.drawSampleHand.bind(this)}" title="Sample Hand">Goldfish</a>
						</div>
					</div>
					`,
				})}
			<div class="deck__list__wrapper">
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
			</div>
			<div class="deck__footer">
				<div class="deck__quick-add" data-drop-target="results">
					${list({ cards: quickAdd, view: 'text', klass: 'quick-add' })}
				</div>
				<input type="text" @change="${this.quickAdd}" placeholder="Quick Add" />
				<span type="button" class="quick-add-close" title="clear" @click=${this.quickAddClose}>&times;</sp>
			</div>
		`;

		render(view, this.$container);
	}
}
