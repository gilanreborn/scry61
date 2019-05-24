import { q, createStore } from './util/reduxLite.js';
import { rootReducer } from './reducers/root.js';
import fetchAllSets from './util/SetFetcher.js';
import Component from './components/component.js';
import Nav from './components/nav.js';
import Accordion from './components/accordion.js';
import Results from './components/results.js';
import Search from './components/search.js';
import Deck from './components/deck.js';
import Inspector from './components/inspector.js';
import Modal from './components/modal.js';

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
		const inspector = new Inspector({ $container: q('#inspector')[0] });
		const modal = new Modal({ $container: q('#modal')[0] });
		this.children = [
			nav,
			search,
			results,
			deck,
			inspector,
			modal,
		];
	}

	bindGlobalEventListeners() {
		document.addEventListener('dragover', this.handleDragOver.bind(this));
		document.addEventListener('dragleave', this.handleDragLeave.bind(this));
		document.addEventListener('dragend', this.handleDragEnd.bind(this));
		// this.on('dragend', 'main', this.handleDrop);
		this.on('dragstart', '.draggable', this.handleDragStart.bind(this));
		this.on('drop', '.droppable', this.handleDrop.bind(this));
		this.on('click', '.modal', this.maybeCloseModal.bind(this));
		document.addEventListener('touchstart', this.handleTouchStart.bind(this));
		document.addEventListener('touchmove', this.handleTouchMove.bind(this));
		document.addEventListener('touchend', this.handleTouchEnd.bind(this));
		document.addEventListener('touchcancel', this.emptyDragBucket.bind(this));
	}

	emptyDragBucket() {
		const dragBucket = q('#hidden-drag-bucket')[0];
		while (dragBucket.firstChild) { dragBucket.removeChild(dragBucket.firstChild) }
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
		const { imgSize, cardView } = window.app.state.results;
		q('body')[0].classList.add('dragging');
		// set the drag image:
		var dragImage = e.target.cloneNode(true);
		dragImage.style.backgroundColor = 'var(--theme-color-3)';
		dragImage.style.width = imgSize + 'px';
		q('#hidden-drag-bucket')[0].appendChild(dragImage);
		e.dataTransfer.setDragImage(dragImage, 0, 0);
		const source = e.target.closest('[data-drop-target]').dataset.dropTarget || 'results';
		const name = e.delegateTarget.getAttribute('title');
		const data = JSON.stringify({ name, source });
		e.dataTransfer.setData('text/plain', data);
		e.dataTransfer.dropEffect = 'copy';
	}

	handleDragOver(e) {
		e.preventDefault();
		e.composedPath().map(el => {
			if (el.classList && el.classList.contains('droppable')) {
				el.classList.add('drag-hover');
			}
		});
	}

	handleDragLeave(e) {
		e.preventDefault();
		e.target.classList && e.target.classList.remove('drag-hover');
	}

	handleDragEnd(e) {
		e.preventDefault();
		this.emptyDragBucket();
		q('body')[0].classList.remove('dragging');
		q('.droppable').map(el => el.classList.remove('drag-hover'));
	}

	handleDrop(e) {
		e.preventDefault();
		q('body')[0].classList.remove('dragging');
		q('.droppable').map(el => el.classList.remove('drag-hover'));

		var data = e.dataTransfer.getData("text/plain");
		const { name, source } = JSON.parse(data);
		const card = window.cards.filter(c => c.name === name)[0];

		const target = e.delegateTarget.dataset.dropTarget || 'remove';
		this.move(card, source, target);
	}

	handleTouchStart(e) {
		const dragItem = e.target.closest('.draggable');
		if (e.targetTouches.length == 1 && dragItem) {
			// We're dragging
			const { imgSize, cardView } = window.app.state.results;
			q('body')[0].classList.add('dragging');
			window.dragSource = dragItem;
			var dragImage = dragItem.cloneNode(true);
			dragImage.style.backgroundColor = 'var(--theme-color-3)';
			dragImage.style.width = imgSize + 'px';
			dragImage.style.position = 'fixed';
			dragImage.style.left = e.targetTouches[0].pageX + 'px';
			dragImage.style.top = e.targetTouches[0].pageY + 'px';
			dragImage.style.opacity = 0.5;
			dragImage.style.zIndex = 13;
			q('#hidden-drag-bucket')[0].appendChild(dragImage);
		}
	}

	handleTouchMove(e) {
		console.log(e);
		const dragImage = q('#hidden-drag-bucket')[0].firstChild;
		if (e.targetTouches.length == 1 && dragImage) {
			const dragX = e.targetTouches[0].pageX;
			const dragY = e.targetTouches[0].pageY;
			dragImage.style.left = dragX + 'px';
			dragImage.style.top = dragY + 'px';
			dragImage.style.pointerEvents = 'none'; // ignore the dragImage when getting elementFromPoint
			const hoveredElement = document.elementFromPoint(dragX, dragY);
			const dropTarget = hoveredElement.closest('.droppable');
			q('.droppable').map(el => el.classList.remove('drag-hover'));
			dropTarget && dropTarget.classList.add('drag-hover');
		}
	}

	handleTouchEnd(e) {
		const x = e.changedTouches[0].clientX;
		const y = e.changedTouches[0].clientY;
		const hoveredElement = document.elementFromPoint(x, y);
		const dropTarget = hoveredElement && hoveredElement.closest('.droppable');
		if ( dropTarget && window.dragSource ) {
			const cardName = window.dragSource.getAttribute('title');
			const card = window.cards.filter(c => c.name === cardName)[0];
			const source = window.dragSource.closest('[data-drop-target]').dataset.dropTarget || 'results';
			const target = dropTarget.dataset.dropTarget;
			this.move(card, source, target);
		}
		this.emptyDragBucket();
		q('body')[0].classList.remove('dragging');
		q('.droppable').map(el => el.classList.remove('drag-hover'));
		window.dragSource = null;
	}

	move(card, source, target) {
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
		switch (target) {
			case 'inspect':
				app.dispatch({ type: 'INSPECT_CARD', payload: card });
				q('#inspector')[0].classList.add('modal');
			break;
			default:
				break;
		}
	}

	maybeCloseModal(e) {
		if ( e.target === e.delegateTarget ) { e.target.classList.remove('modal'); }
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

	app.update(app.state);
});
