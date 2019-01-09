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
		case 'SET_CARD_COLORS':
			return { ...state, colors: payload };
		case 'SET_CARD_COLOR_OPTIONS':
			return { ...state, colorOptions: payload };
		case 'SET_CARD_TYPE':
			return { ...state, cardType: payload };
		case 'SET_CARD_SUPERTYPES':
			return { ...state, cardSuperType: payload };
		case 'SET_CARD_SUPERTYPE_OPTIONS':
			return { ...state, cardSuperTypeOptions: payload };
		case 'SET_CARD_TEXT':
			return { ...state, cardText: payload };
		case 'SET_CARD_CMC':
			return { ...state, cmc: payload };
		case 'SET_CARD_PWR':
			return { ...state, power: payload };
		case 'SET_CARD_TGH':
			return { ...state, toughness: payload };
		case 'RESTORE_SEARCH_DEFAULTS':
			// window.localStorage.clear();
			return defaultState;
		default:
			return state;
	}
}