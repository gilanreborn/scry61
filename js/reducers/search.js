const defaultState = {
	cardName: '',
	colors: [],
	colorOptions: 'OR',
	rarity: [],
	rarityOptions: 'OR',
	cardType: '',
	cardSuperTypes: [],
	cardSuperTypeOptions: 'OR',
	cardText: '',
	format: '',
	cmc: {min: NaN, max: NaN},
	power: {min: NaN, max: NaN},
	toughness: {min: NaN, max: NaN},
};


const initialState = defaultState;

export default function SearchReducer(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case 'SET_CARD_NAME':
			return { ...state, cardName: payload };
		case 'CLEAR_CARD_NAME':
			return { ...state, cardName: '' };
		case 'RESTORE_SEARCH_DEFAULTS':
			// window.localStorage.clear();
			return defaultState;
		default:
			return state;
	}
}