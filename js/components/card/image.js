import { html, svg, render } from '/node_modules/lit-html/lit-html.js';

export default function image({ card, printing }) {
	if ( !card ) return;
	let sourcePath = `https://api.scryfall.com/cards/named?fuzzy=${card.name.split(' ').join('+').split('\'').join('')}&format=image${printing ? `&set=${printing}` : ''}`;

	return html`
		<img class="card__image draggable"
			src="${sourcePath}"
			alt="${card.name}"
			title="${card.name}"
			draggable="true"
		/>
	`;
}