import { combineReducers } from '../util/reduxLite.js';
import search from './search.js';
import results from './results.js';
import filters from './filters.js';
import preferences from './prefs.js';
import deck from './deck.js';

export const rootReducer = combineReducers({
	search,
	results,
	deck,
	filters,
	preferences,
});