import { html, svg, render } from 'https://unpkg.com/lit-html?module';
import Component from './component.js';

export default class Modal extends Component {
  constructor(options) {
    super(options);
  }

  closeModal() {
    app.dispatch({ type: 'HIDE_MODAL' });
  }

  update(props) {
    const { show, content, title = 'Test Title' } = app.state.modal;
    const view = html`
      <div class="modal-wrapper modal-wrapper--${show ? 'show' : 'hide'}">
        <div class="modal-hider" @click="${this.closeModal}"></div>
        <div class="modal-container">


          <div class="modal__header">
            <h3>${title}</h3><span class="modal__close" @click="${this.closeModal}">&times;</span>
          </div>
          <div class="modal__content__wrapper">
            <div class="modal__content">
              ${content}
            </div>
          </div>

        </div>
      </div>
    `;

    render(view, this.$container);
  }
 }