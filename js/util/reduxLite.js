// REDUX LITE:

window.uuid = 0;

const combineReducers = obj => {
	return function (state, action) {
		let nextState = {};
		Object.keys(obj).map(key => {
			if (state) {
				nextState[key] = obj[key](state[key], action);
			} else {
				nextState[key] = obj[key](undefined, {}); // handle init:
			}
		});
		// handle flag for stale reducers
		return nextState;
	}
};

const createStore = (rootReducer, initialState, options = {}) => {
	var store = {
		rootReducer,
		subscriptions: [],
		subscribe(items) { this.subscriptions.push(...items.flat()) },
		unsubscribe(item) { this.subscriptions = this.subscriptions.filter(sub => sub !== item) },
		queue: [],
		state: rootReducer(initialState, {}),
		dispatch(action) {
			const { state, rootReducer, queue } = this;
			this.prevState = state;
			this.state = rootReducer(state, action);
			queue.push(action);
			window.setTimeout(function () {
				if (this.queue.length) {
					this.queue = [];
					this.update(this.state, this.prevState);
				}
			}.bind(this), 0);
		},
		update(state, prevState) { this.subscriptions.map(sub => sub.update(state, prevState)) },
	};
	return Object.assign(store, options);
};

const chain = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);
const q = selector => [...document.querySelectorAll(selector)];
const deriveInitialState = (rootNode, selector) => {
	// TODO;
};

export {
	chain,
	q,
	combineReducers,
	createStore,
	deriveInitialState,
};

// // PRIVATE:
// const bindEvent = (eventName, selector, callback) => function (evt) {
// 	const target = selector ? matchDelegate(evt.target, selector) : evt.target;
// 	if ( !target ) return false; // evt does not apply to us
// 	const types = target.getAttribute && target.getAttribute(`on-${eventName}`);
// 	const payload = target.dataset;
// 	if ( selector ) evt.delegateTarget = target;

// 	callback && callback(evt, { target, types, payload });
// 	types && types.split(' ').map(type => app.dispatch({ type, payload }));
// };

// const matchDelegate = (el, selector) => {
// 	if ( !el.parentNode ) return null;
// 	if ( el.matches(selector) ) return el;
// 	return matchDelegate(el.parentNode, selector);
// }

// const typeOf = (arg) => {
// 	return Array.isArray(arg) ? 'array' : typeof arg;
// };