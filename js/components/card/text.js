import { html, svg, render } from '/node_modules/lit-html/lit-html.js';
import textBox from './textBox.js';
import titleBox from './titleBox.js';

export default function text({ card, printing, collapsed }) {
	return html`
		<article class="card non-selectable draggable"
			draggable="true"
			title="${card.name}"
		>
			${titleBox({ card, printing, collapsed })}
			${textBox({ card, printing })}
		</article>
	`;
}