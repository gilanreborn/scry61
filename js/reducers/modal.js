const initialState = {
  title: '',
  show: false,
  content: '',
};

export default function modalReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case 'SHOW_MODAL':
      return { ...state, show: true };
    case 'HIDE_MODAL':
      return { ...state, show: false };
    case 'SET_MODAL_CONTENT':
      return { ...state, ...payload };
    default:
      return state;
  }
}