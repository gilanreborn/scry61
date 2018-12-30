const defaultState = {};

const initialState = defaultState;

export default function FiltersReducer(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case 'ADD_FILTER':
			return { ...state, ...payload };
		case 'REMOVE_FILTER':
			return { ...state, ...payload };
		case 'RESTORE_FILTER_DEFAULTS':
			return defaultState;
		default:
			return state;
	}
}