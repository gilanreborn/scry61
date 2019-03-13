import { q, createStore } from './util/reduxLite.js';
import { rootReducer } from './reducers/root.js';
import { html, render } from 'https://unpkg.com/lit-html?module';
import fetchAllSets from './util/SetFetcher.js';
import Component from './components/component.js';
import Nav from './components/nav.js';
import Accordion from './components/accordion.js';
import Results from './components/results.js';
import Search from './components/search.js';
import Deck from './components/deck.js';

window.q = q;

export default class UI extends Component {
	constructor(options) {
		super(options);

		this.bindChildren();
		this.bindGlobalEventListeners();
		this.fetchCardInfo();
	}

	bindChildren() {
		const nav = new Nav({ $container: q('.header')[0], });
		const search = new Search({ $container: q('.search')[0] });
		const results = new Results({ $container: q('.results')[0] });
		const deck = new Deck({ $container: q('.deck')[0] });
		this.children = [
			nav,
			search,
			results,
			deck,
		];
	}

	bindGlobalEventListeners() {
		document.addEventListener('dragover', this.handleDragOver);
		document.addEventListener('dragleave', this.handleDragLeave);
		document.addEventListener('dragend', this.handleDragEnd);
		// this.on('dragend', 'main', this.handleDrop);
		this.on('dragstart', '.draggable', this.handleDragStart);
		this.on('drop', '.droppable', this.handleDrop);
	}

	fetchCardInfo() {
		const self = this;
		fetchAllSets().then(AllSets => {
			const AllCards = self.buildAllCards(AllSets);
			const dummy = { name: '', type: '', text: '', colors: [], convertedManaCost: 0, rarities: [], };
			const cards = Object.values(AllCards)
				.filter(c => c.name)
				.map(c => Object.assign({}, dummy, c));
			window.cards = cards;
			window.app.dispatch({
				type: 'CARD_FETCH_SUCCESS',
			});
		});
	}

	buildAllCards(AllSets) {
		let AllCards = {};
		Object.values(AllSets).forEach(set => {
			const { code, cards, type, releaseDate, magicCardsInfoCode } = set;
			const setName = set.name;
			cards.forEach(c => {
				AllCards[c.name] = AllCards[c.name] || c;
				// types
				AllCards[c.name].types = AllCards[c.name].types || [];
				// rarities
				AllCards[c.name].rarities = AllCards[c.name].rarities || [];
				if (type === 'core' || type === 'expansion') {
					AllCards[c.name].rarities.push(c.rarity); // only include rarity values from format-legal sets.
					if (c.rarity === "Basic Land") { AllCards[c.name].rarities.push("Common"); } // treat basics as common
				}
				// formats & legality
				// AllCards[c.name].formats = AllCards[c.name].formats || {};
				// AllCards[c.name].formats = this.calculateFormats(c, type, releaseDate, AllCards[c.name].formats);
				// printings, artists, & flavor text
				AllCards[c.name].sets = AllCards[c.name].sets || [];
				AllCards[c.name].sets.push({
					set: code,
					setName: setName,
					artist: c.artist,
					flavorText: c.flavorText,
					mciNumber: c.number,
					multiverseId: c.multiverseId,
					rarity: c.rarity,
				});
			});
		});
		return AllCards;
	}

	handleDragStart(e) {
		q('body')[0].classList.add('dragging');
		const source = e.target.closest('[data-drop-target]').dataset.dropTarget || 'results';
		const name = e.delegateTarget.getAttribute('title');
		const data = JSON.stringify({ name, source });
		e.dataTransfer.setData('text/plain', data);
		e.dataTransfer.dropEffect = 'copy';
	}

	handleDragOver(e) {
		e.preventDefault();
		// q('.droppable').map(el => el.classList.remove('drag-hover'));
		if (e.target.classList && e.target.classList.contains('droppable')) {
			e.target.classList.add('drag-hover');
		}
	}

	handleDragLeave(e) {
		e.preventDefault();
		e.target.classList && e.target.classList.remove('drag-hover');
	}

	handleDragEnd(e) {
		e.preventDefault();
		q('body')[0].classList.remove('dragging');
		q('.droppable').map(el => el.classList.remove('drag-hover'));
	}

	handleDrop(e) {
		e.preventDefault();
		q('body')[0].classList.remove('dragging');
		q('.droppable').map(el => el.classList.remove('drag-hover'));

		var data = e.dataTransfer.getData("text/plain");
		const { name, source } = JSON.parse(data);
		// if (!name) { return false; }
		const card = window.cards.filter(c => c.name === name)[0];
		// if (!card) { return false; }

		const target = e.delegateTarget.dataset.dropTarget || 'remove';
		switch (`${source} --> ${target}`) {
			case 'results --> main':
				app.dispatch({ type: 'ADD_CARD_TO_MAIN', payload: card });
				break;
			case 'results --> side':
				app.dispatch({ type: 'ADD_CARD_TO_SIDE', payload: card });
				break;
			case 'main --> remove':
				app.dispatch({ type: 'REMOVE_CARD_FROM_MAIN', payload: card });
				break;
			case 'main --> side':
				app.dispatch({ type: 'REMOVE_CARD_FROM_MAIN', payload: card });
				app.dispatch({ type: 'ADD_CARD_TO_SIDE', payload: card });
				break;
			case 'side --> remove':
				app.dispatch({ type: 'REMOVE_CARD_FROM_SIDE', payload: card });
				break;
			case 'side --> main':
				app.dispatch({ type: 'REMOVE_CARD_FROM_SIDE', payload: card });
				app.dispatch({ type: 'ADD_CARD_TO_MAIN', payload: card });
				break;
			default:
				break;
		}
	}

	update(props, oldProps) {
		const { $container } = this;
		const { search, results, deck } = props.preferences.show;
		q('section.search')[0].classList.toggle('show', search);
		q('section.results')[0].classList.toggle('show', results);
		q('section.deck')[0].classList.toggle('show', deck);
		this.children.map(child => child.update(props, oldProps));
	}
}

window.addEventListener('load', function (e) {
	if (false && 'serviceWorker' in navigator) {
		navigator.serviceWorker.register('/sw.js').then(
			registration => console.log('SW registration successful; scope: ', registration.scope),
			err => console.log('ServiceWorker registration failed: ', err)
		);
	}

	var provider = window.app = createStore(rootReducer);
	const view = new UI({ $container: q('#root')[0] });
	provider.subscribe([ view ]);

	// document.addEventListener("dragend", function(e) {
	//   debugger;
	// }, false);

	// document.addEventListener("drop", function( event ) {
	//   // prevent default action (open as link for some elements)
	//   event.preventDefault();
	//   // move dragged elem to the selected drop target
	// }, false);

	app.update(app.state);
});
