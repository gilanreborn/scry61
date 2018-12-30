import { html, svg, render } from 'https://unpkg.com/lit-html?module';

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