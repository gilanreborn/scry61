const defaultState = {
	page: 0,
	pageSize: 48,
	cardView: 'IMAGE',
	imgSize: 200,
	moreOptions: false,
	sorts: {},
};

const initialState = defaultState;

export default function ResultsReducer(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case 'INCREASE_IMG_SIZE':
			return { ...state, imgSize: state.imgSize + 10, };
		case 'DECREASE_IMG_SIZE':
			return { ...state, imgSize: state.imgSize - 10, };
		case 'SET_PAGE_SIZE':
			return { ...state, pageSize: payload };
		case 'INCREMENT_PAGE_NUMBER':
			let nextPage = state.page + payload;
			if ( nextPage < 0 ) { nextPage = 0; }
			return { ...state, page: nextPage };
		case 'ADD_FILTER':
			return { ...state, page: 0 };
		case 'RESTORE_DEFAULTS':
			// window.localStorage.clear();
			return defaultState;
		default:
			return state;
	}
}