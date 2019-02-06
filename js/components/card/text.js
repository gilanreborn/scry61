import { html, svg, render } from 'https://unpkg.com/lit-html?module';
import textBox from './textBox.js';
import titleBox from './titleBox.js';

export default function text({ card, printing, collapsed }) {
	const handleDrag = e => {
		q('body')[0].classList.add('dragging');
		e.dataTransfer.setData('text/plain', card.name);
		// e.dataTransfer.setDragImage(img, 0, 0);
		e.dataTransfer.dropEffect = 'copy';
		console.log(e);
	};
	return html`
		<article class="card non-selectable draggable"
			@dragstart="${handleDrag}"
			draggable="true"
			title="${card.name}"
		>
			${titleBox({ card, printing, collapsed })}
			${textBox({ card, printing })}
		</article>
	`
}