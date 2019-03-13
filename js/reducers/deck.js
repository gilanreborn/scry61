const id = Date.now();

const defaultState = {
	id,
	title: '',
	main: [],
	side: [],
};

const initialState = defaultState;

export default function DeckReducer(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case 'ADD_CARD_TO_MAIN':
			return { ...state, main: [...state.main, payload] };
		case 'REMOVE_CARD_FROM_MAIN':
			var i = state.main.indexOf(payload);
			return { ...state, main: state.main.filter((_, idx) => idx !== i) };
		case 'ADD_CARD_TO_SIDE':
			return { ...state, side: [...state.side, payload] };
		case 'REMOVE_CARD_FROM_SIDE':
			var i = state.side.indexOf(payload);
			return { ...state, side: state.side.filter((_, idx) => idx !== i) };
		case 'RESTORE_DECK_DEFAULTS':
			// window.localStorage.clear();
			return defaultState;
		case 'SET_DECK_TITLE':
			return { ...state, title: payload };
		case 'IMPORT_DECKLIST':
			return payload;
		case 'MAKE_NEW_DECK':
			return { ...defaultState, id: Date.now() };
		default:
			return state;
	}
}