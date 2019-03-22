import { html, svg, render } from 'https://unpkg.com/lit-html?module';

export default function image({ card, printing }) {
	if ( !card ) return;
	let sourcePath = `https://api.scryfall.com/cards/named?fuzzy=${card.name.split(' ').join('+').split('\'').join('')}&format=image&set=${printing || ''}`;

	return html`
		<img class="card__image draggable"
			src="${sourcePath}"
			alt="${card.name}"
			title="${card.name}"
			draggable="true"
		/>
	`;
}