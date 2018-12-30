import { html, svg, render } from 'https://unpkg.com/lit-html?module';
import mapSetToCode from '../../util/mapSetToCode.js';

export default function image(card, printing) {
	let sourcePath = `https://api.scryfall.com/cards/named?fuzzy=${card.name.split().join('+')}&format=image`;

	return html`
		<img className='card-image'
			src="${sourcePath}"
			alt="${card.name}"
			title="${card.name}"
		/>
	`;
}