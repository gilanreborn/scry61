import Component from './component.js';

export default class Accordion extends Component {
  constructor(options = {}) {
    super(options);

    this.bindEventListeners.bind(this)();
    q('.accordion__title').map(el => el.setAttribute('tabindex', '0'));
  }

  bindEventListeners() {
    this.on('keyup', '.accordion__title', evt => {
      if ( evt.key === 'Enter' ) {
        evt.currentTarget.classList.toggle('open');
      }
    });

    this.on('click', '.accordion__title', evt => {
      evt.currentTarget.classList.toggle('open');
    });
  }
}