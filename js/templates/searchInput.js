import { html, svg, render } from '/node_modules/lit-html/lit-html.js';
import input from './input.js';

export default function searchInput(options) {
	const { legend, clear } = options;
	return html`
		<fieldset class="search__fieldset">
			<legend class="search__fieldset__legend">${legend}</legend>
			${input(options)}
			<button class="search__fieldset__clear" @click=${clear}>X</button>
		</fieldset>
	`
}