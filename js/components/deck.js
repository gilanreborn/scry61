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

	handleDragOver(e) {
		e.preventDefault();
	}

	handleDrop(ev) {
		ev.preventDefault();
		q('body')[0].classList.remove('dragging');
		var cardName = ev.dataTransfer.getData("text/plain");
		const card = window.cards.filter(c => c.name === cardName)[0];
		window.app.dispatch({
			type: 'ADD_CARD_TO_MAIN',
			payload: card,
		});
	}

	update(props, oldProps) {
		const { main, side } = props.deck;
		const deckObj = this.buildDeckObj(main);
		const sideObj = this.buildDeckObj(side);
		const mainList = this.buildDeckList({ deckObj });
		const sideList = this.buildDeckList({ deckObj: sideObj });
		// const sideList = this.buildCardList(side, 'side');
		const view = html`
			<div class="deck__header">
				<h2 class="deck__header__title">Deck</h2>
			</div>
			<div class="deck__options">
			</div>
			<div class="deck__list flex--col">
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
