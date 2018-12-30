const defaultState = {
	page: 0,
	pageSize: 12,
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
		case 'RESTORE_DEFAULTS':
			// window.localStorage.clear();
			return defaultState;
		default:
			return state;
	}
}