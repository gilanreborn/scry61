import { html, svg, render } from '/node_modules/lit-html/lit-html.js';
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
			<div class="modal-content">
				<div class="modal__header triptych">
					<span class="flex-spacer grid-left"></span>
					<h3 class="modal__header__title grid-center">${title}</h3>
					<span class="modal__close grid-right" @click="${this.closeModal}">&times;</span>
				</div>
				<div class="modal__content__wrapper">
					<div class="modal__content">${content}</div>
				</div>
			</div>
		`;

		this.$container.style.zIndex = show ? 8 : -1;

		render(view, this.$container);
	}
 }