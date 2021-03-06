const id = Date.now();

const defaultState = {
	id,
	title: '',
	main: [],
	side: [],
	quickAdd: [],
};

const initialState = defaultState;

export default function DeckReducer(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case 'ADD_CARD_TO_MAIN':
			return { ...state, main: [...state.main, payload] };
		case 'REMOVE_CARD_FROM_MAIN':
			var i = state.main.findIndex(card => card.name === payload.name);
			return { ...state, main: state.main.filter((_, idx) => idx !== i) };
		case 'ADD_CARD_TO_SIDE':
			return { ...state, side: [...state.side, payload] };
		case 'REMOVE_CARD_FROM_SIDE':
			var i = state.side.findIndex(card => card.name === payload.name);
			return { ...state, side: state.side.filter((_, idx) => idx !== i) };
		case 'QUICK_ADD':
			return { ...state, quickAdd: payload };
		case 'RESTORE_DECK_DEFAULTS':
			// window.localStorage.clear();
			return defaultState;
		case 'SET_DECK_TITLE':
			return { ...state, title: payload };
		case 'IMPORT_DECKLIST':
			return { ...state, ...payload };
		case 'MAKE_NEW_DECK':
			return { ...defaultState, title: '', id: Date.now() };
		default:
			return state;
	}
}