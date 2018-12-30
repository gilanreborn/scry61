import { q } from '../util/utils.js';
import { html, render } from 'https://unpkg.com/lit-html?module';
import Component from './component.js';
import svgIcon from '../templates/svgs/icon.js';

export default class Nav extends Component {
  constructor(options = {}) {
    super(options);
    this._state = {
      vPos: 'top',
      hPos: 'left',
      open: false,
    };
  }

  reposition(e) {
    const [vPos, hPos] = e.target.value.toLowerCase().split(' ');
    this.setState({ vPos, hPos });
  }

  setThemeColor1(e) {
    const data = e.target.value;
    q('html')[0].style.setProperty('--theme-color-1', data);
    q('meta[name="theme-color"]')[0].setAttribute('content', data);
  }
  setThemeColor2(e) {
    const data = e.target.value;
    q('html')[0].style.setProperty('--theme-color-2', data);
  }
  setThemeColor3(e) {
    const data = e.target.value;
    q('html')[0].style.setProperty('--theme-color-3', data);
  }

  toggleMenu(e) {
    this.setState({ open: !this._state.open });
  }

  maybeToggleMenu(e) {
    e.key === "Enter" && this.toggleMenu(e);
  }

  toggleView(pane) {
    return function(e) {
      window.app.dispatch({
        type: 'TOGGLE_PANE',
        payload: pane,
      });
    }
  }

  update(props, oldProps) {
    const { hPos, vPos, open } = this._state;
    const { search, results, deck } = props.preferences.show;
    const view = html`
      <div class="nav ${open ? 'open' : ''}">
        <div class="flex-spacer"></div>
        <div class="nav__icon nav__hamburger-menu"
          style="${vPos}: 0; ${hPos}: 0;"
          tabindex="0"
          @click="${this.toggleMenu.bind(this)}"
          @keyup="${this.maybeToggleMenu.bind(this)}"
        >
          <hr>
          <hr>
          <hr>
        </div>
        <nav class="nav__menu" style="${vPos}: 0; ${hPos}: 0;">
          <ul class="nav__menu__list"
            style="
              justify-content: ${vPos === 'top' ? 'flex-start' : 'flex-end'};
              text-align: ${hPos};
            "
          >
            <li><span class="nav__menu__list-item nav__menu__list-item--spacer"></span></li>
            <li><a class="${search ? 'active' : ''}" @click=${this.toggleView('search')} class="nav-first">Search</a></li>
            <li><a class="${results ? 'active' : ''}" @click=${this.toggleView('results')}>Results</a></li>
            <li><a class="${deck ? 'active' : ''}" @click=${this.toggleView('deck')}>Deck</a></li>
            <li>
              <ul class="accordion"
                @keyup="${e => e.key === 'Enter' && e.currentTarget.classList.toggle('open')}"
                tabindex="0"
              >
                <li class="accordion__title"
                  @click="${e => e.currentTarget.parentElement.classList.toggle('open')}"
                >Preferences
                  <span class="accordion__arrow">${svgIcon('chevron')}</span>
                </li>
                <li>
                  <label>Menu Position:
                    <select @change="${this.reposition.bind(this)}" style="background-color: #333; padding: 4px 0;">
                      <option selected>Top Left</option>
                      <option>Top Right</option>
                      <option>Bottom Left</option>
                      <option>Bottom Right</option>
                    </select>
                  </label>
                </li>
                <li class="theme-color-setter">
                  <div>Theme Color</div>
                  <div class="theme-color-setter-options">
                    <input @change="${this.setThemeColor1.bind(this)}" type="color" value="#ffaa00" default="#ffaa00">
                    <input @change="${this.setThemeColor2.bind(this)}" type="color" value="#800080" default="#800080">
                    <input @change="${this.setThemeColor3.bind(this)}" type="color" value="#333333" default="#333333">
                  </div>
                </li>
              </ul>
            </li>
            <li><span class="nav__menu__list-item nav__menu__list-item--spacer"> </span></li>
          </ul>
        </nav>
        <span class="nav__close" @click="${this.toggleMenu.bind(this)}"></span>
        <h1 class="nav__title">Scry61</h1>
        <span class="nav__more"></span>
      </div>
    `;
    render(view, this.$container);
  }

}