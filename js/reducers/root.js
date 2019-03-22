import { combineReducers } from '../util/reduxLite.js';
import search from './search.js';
import results from './results.js';
import filters from './filters.js';
import preferences from './prefs.js';
import deck from './deck.js';
import modal from './modal.js';
import inspector from './inspector.js';

export const rootReducer = combineReducers({
	search,
	results,
	deck,
	filters,
	preferences,
	modal,
	inspector,
});