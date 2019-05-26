import { q } from '../util/utils.js';
import { html, render } from '/node_modules/lit-html/lit-html.js';
import Component from './component.js';

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
    app.dispatch({ type: 'SET_NAV_POS', payload: { vPos, hPos } });
  }

  savePreferences(e) {
    const Scry61 = window.localStorage;
    Scry61.setItem('preferences', JSON.stringify(app.state));
  }

  setThemeColor1(e) {
    const data = e.target.value;
    q('html')[0].style.setProperty('--theme-color-1', data);
    q('meta[name="theme-color"]')[0].setAttribute('content', data);
    app.dispatch({ type: 'SET_THEME_COLOR', payload: { primary: data } });
  }
  setThemeColor2(e) {
    const data = e.target.value;
    q('html')[0].style.setProperty('--theme-color-2', data);
    app.dispatch({ type: 'SET_THEME_COLOR', payload: { secondary: data } });
  }
  setThemeColor3(e) {
    const data = e.target.value;
    q('html')[0].style.setProperty('--theme-color-3', data);
    app.dispatch({ type: 'SET_THEME_COLOR', payload: { tertiary: data } });
  }

  toggleMenu(e) {
    this.setState({ open: !this._state.open });
  }
  toggleLogoView(e) {
    e.target.value === 'show'
      ? q('header')[0].style.setProperty('max-height', '200px')
      : q('header')[0].style.setProperty('max-height', 0);
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
            <li style="padding: 1em">
              <div>Preferences</div>
              <div class="expando">
                <div class="expando-box">
                  <div class="preferences__form">
                    <div class="menu-position-setter">
                      <label>Menu Position:
                        <select @change="${this.reposition.bind(this)}" style="background-color: #333; padding: 4px 0;">
                          <option selected>Top Left</option>
                          <option>Top Right</option>
                          <option>Bottom Left</option>
                          <option>Bottom Right</option>
                        </select>
                      </label>
                    </div>
                    <div class="theme-color-setter">
                      <div>Theme Color</div>
                      <div class="theme-color-setter-options">
                        <input @change="${this.setThemeColor1.bind(this)}" type="color" value="#ffaa00" default="#ffaa00">
                        <input @change="${this.setThemeColor2.bind(this)}" type="color" value="#800080" default="#800080">
                        <input @change="${this.setThemeColor3.bind(this)}" type="color" value="#333333" default="#333333">
                      </div>
                    </div>
                    <div class="logo-hider">
                      <div>Logo</div>
                      <ul>
                        <li>
                          <input type="radio"
                            id="logo-hider--show"
                            class="logo-hider__radio__button"
                            name="radio-group--logo-hider"
                            @click=${this.toggleLogoView}
                            value="show"
                            checked="true"
                          >
                          <label class="logo-hider__radio__label"
                            for="logo-hider--show"
                            title="Show"
                          >Show</label>
                        </li>
                        <li>
                          <input type="radio"
                            id="logo-hider--hide"
                            class="logo-hider__radio__button"
                            name="radio-group--logo-hider"
                            @click=${this.toggleLogoView}
                            value="hide"
                          >
                          <label class="logo-hider__radio__label"
                            for="logo-hider--hide"
                            title="Hide"
                          >Hide</label>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="expando-arrow" @click=${e => e.target.parentElement.classList.toggle('open')}>
                  &#9660;
                </div>
              </div>
            </li>
            <li><a @click="${this.savePreferences}" >Save Preferences (TODO)</a></li>
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