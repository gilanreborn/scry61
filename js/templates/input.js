import { html, svg, render } from '/node_modules/lit-html/lit-html.js';

export default function input(options) {
	const { onChange, value, placeholder, classList } = options;
	return html`
		<input type="text"
			class="${classList}"
			@change=${onChange}
			.value="${value}"
			.placeholder=${placeholder || ''}
		>
	`;
}