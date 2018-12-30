import Component from './component.js';
import { q } from '../utils/reduxLite.js';

export default class List extends Component {
  constructor(options = {}) {
    super(options);

    this.bindEventListeners.bind(this)();
  }

}