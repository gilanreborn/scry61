import { html, svg, render } from '/node_modules/lit-html/lit-html.js';
import icon from '../../templates/icon.js';

export default function titleBox({ card, printing, collapsed = false }) {
	const formatText = (text = '') => {
		return text.split('\n').map(block => {
			const blocks = block.split(/{|}/g).map((t, i) => {
				return i % 2 ? icon(t) : html`<span>${t}</span>`;
			});
			return html`<span>${blocks}</span>`;
		});
	}

	return html`
		<div class="card__title-box ${collapsed ? 'collapsed' : ''}"
			@click=${e => e.currentTarget.classList.toggle('collapsed')}
		>
			<span class="card__name">
				${card.name}
			</span>
			<span class="card__mana-cost">
				${formatText(card.manaCost)}
			</span>
		</div>
	`;
}