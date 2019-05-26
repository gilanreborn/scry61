const initialState = {
  library: [],
  hand: [],
  battlefield: [],
  graveyard: [],
  exile: [],
}

export default function GameReducer(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
    case 'LOAD_DECK':
      const { decklist } = payload;
      return { ...state, library: decklist };
      break;
    case 'SHUFFLE_DECK':
      const { library } = state;
      return { ...state, library: randomize([...library]) };
      break;
    case 'START_GAME':
      const { library: [a, b, c, d, e, f, g, ...deck] } = state;
      return { ...state, library: deck, hand: [a, b, c, d, e, f, g] };
      break;
    case 'DRAW_CARD':
      const { library: [topdeck, ...rest], hand } = state;
      return { ...state, library: rest, hand: [topdeck, ...hand] };
      break;
    case 'MOVE_CARD':
      const { card, from, to } = payload;
      const fromArr = state[from];
      const toArr = state[to];
      const idx = fromArr.findIndex(c => c.name === card.name);
      return { ...state, [from]: fromArr.filter((_, i) => i !== idx), [to]: [card, ...toArr] };
      break;
    case 'RESET_GAME':
      return initialState;
		default:
			return state;
	}
}

function randomize(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]]; // swap elements
  }
  return array;
}

function removeFirst(src, element) {
  const index = src.indexOf(element);
  if (index === -1) return src;
  return [...src.slice(0, index), ...src.slice(index + 1)];
}
