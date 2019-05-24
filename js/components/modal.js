import { html, svg, render } from '/node_modules/lit-html/lit-html.js';
import Component from './component.js';

export default class Modal extends Component {
	constructor(options) {
		super(options);
	}

	update(props) {
		const { show, content, title = 'Test Title' } = app.state.modal;

		const view = html`
			<div class="modal-content">
				<div class="modal__header triptych">
					<h3 class="modal__header__title grid-center">${title}</h3>
				</div>
				<div class="modal__content__wrapper">
					<div class="modal__content">${content}</div>
				</div>
			</div>
		`;

		render(view, this.$container);
	}
 }