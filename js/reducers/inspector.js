const initialState = {
  card: { name: 'Forest', sets: [] },
  printing: null,
  face: 'front',
}

export default function InspectorReducer(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
    case 'INSPECT_CARD':
      return { ...state, card: payload };
      break;
    case 'INSPECT_PRINTING':
      return { ...state, printing: payload };
      break;
    case 'INSPECT_CARD_BACK':
      return { ...state, face: payload };
		default:
			return state;
	}
}