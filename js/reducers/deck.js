const defaultState = {
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
			return { ...state, main: state.main.filter(c => c !== payload) };
		case 'ADD_CARD_TO_SIDE':
			return { ...state, side: [...state.side, payload] };
		case 'REMOVE_CARD_FROM_SIDE':
			return { ...state, side: state.side.filter(c => c !== payload) };
		case 'RESTORE_DECK_DEFAULTS':
			// window.localStorage.clear();
			return defaultState;
		default:
			return state;
	}
}