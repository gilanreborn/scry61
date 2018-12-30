

export default class Component {
  constructor(options = {}) {
    this.$container = options.$container || document;
    this._state = options._state || {};
    // this._children = [];
  }

  on(eventType, delegateSelector, callback, thisArg = this) {
    this.$container.addEventListener(eventType, event => {
      const delegateTarget = [
        ...thisArg.$container.querySelectorAll(delegateSelector)
      ].filter(el => el.contains(event.target))[0];

      if ( delegateTarget ) {
        event.delegateTarget = delegateTarget;
        callback.bind(thisArg)(event);
      }
    });
  }

  setState(options) {
    this._state = { ...this._state, ...options, _lastChanged: Object.keys(options) };
    this.update(window.app.state);
    // this._children.map(child => child.update());
  }

  update() {
    console.warn('A component\'s update function was invoked without being defined');
    // defined by inheritor classes
  }
}