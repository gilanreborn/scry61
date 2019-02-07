import { html, svg, render } from 'https://unpkg.com/lit-html?module';
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
	`
}