const initialState = [
	{ text: 'Call Michael', done: false },
	{ text: 'Call Kathie', done: false },
	{ text: 'Call Pablo', done: false },
	{ text: 'Call Ting', done: false },
	{ text: 'Email Alex', done: false },
	{ text: 'Email Dana', done: false },
];

export default function TodosReducer(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case 'ADD_TODO':
			return [payload, ...state];
		case 'REMOVE_TODO':
			return state.filter(todo => todo.key !== payload);
		case 'TOGGLE_TODO':
			return state.map((todo, idx) => {
				return idx === payload ? { ...todo, done: !todo.done } : todo;
			});
		default:
			return state;
	}
}