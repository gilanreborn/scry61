import { html, svg, render } from 'https://unpkg.com/lit-html?module';
import mapSetToCode from '../../util/mapSetToCode.js';

export default function image(card, printing) {
	let sourcePath = `https://api.scryfall.com/cards/named?fuzzy=${card.name.split().join('+')}&format=image`;

	return html`
		<img class="card__image"
			src="${sourcePath}"
			alt="${card.name}"
			title="${card.name}"
		/>
	`;
}