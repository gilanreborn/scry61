import { html, svg, render } from 'https://unpkg.com/lit-html?module';
import textBox from './textBox.js';
import titleBox from './titleBox.js';

export default function text({ card, printing, collapsed }) {
	const handleDrag = e => {
		q('body')[0].classList.add('dragging');
		const source = e.target.closest('[data-drop-target]').dataset.dropTarget || 'results';
		const name = card.name;
		const data = JSON.stringify({ name, source });
		e.dataTransfer.setData('text/plain', data);
		e.dataTransfer.dropEffect = 'copy';
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