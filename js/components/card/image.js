import { html, svg, render } from 'https://unpkg.com/lit-html?module';

export default function image({ card, printing }) {
	let sourcePath = `https://api.scryfall.com/cards/named?fuzzy=${card.name.split().join('+')}&format=image`;
	const handleDrag = e => {
		q('body')[0].classList.add('dragging');
		e.dataTransfer.setData('text/plain', card.name);
		e.dataTransfer.dropEffect = 'copy';
	};
	return html`
		<img class="card__image draggable"
			src="${sourcePath}"
			alt="${card.name}"
			title="${card.name}"
			@dragstart=${handleDrag}
			?draggable="true"
		/>
	`;
}