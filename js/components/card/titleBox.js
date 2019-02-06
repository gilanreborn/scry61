import { html, svg, render } from 'https://unpkg.com/lit-html?module';
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
	const handleDrag = e => {
		q('body')[0].classList.add('dragging');
		e.dataTransfer.setData('text/plain', card.name);
		e.dataTransfer.dropEffect = 'copy';
	};

	return html`
		<div class="card__title-box ${collapsed ? 'collapsed' : ''}"
			@click=${e => e.currentTarget.classList.toggle('collapsed')}
			@dragstart=${handleDrag}
			?draggable="true"
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