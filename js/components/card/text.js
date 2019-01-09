import { html, svg, render } from 'https://unpkg.com/lit-html?module';
import textBox from './textBox.js';
import titleBox from './titleBox.js';

export default function text(card, printing) {
	return html`
		<article class="card">
			${titleBox(card, printing)}
			${textBox(card, printing)}
		</article>
	`
}