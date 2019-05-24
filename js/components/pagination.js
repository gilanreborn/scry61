import { html } from '/node_modules/lit-html/lit-html.js';

export default function pagination({ page, pageCountCurrent, pageCountTotal, callback, klass }) {
	return html`
		<div class="pagination__container pagination__container--${klass}">
			<button class="pagination__arrow pagination__arrow--left non-selectable"
				@click=${callback}
				value="-3"
				?disabled=${page === 0}
			>◄◄</button>
			<button class="pagination__arrow pagination__arrow--left non-selectable"
				@click=${callback}
				value="-1"
				?disabled=${page === 0}
			>◄</button>
			<span class="pagination__text">
				<span class="pagination__title--inner">Page</span> ${pageCountCurrent} of ${pageCountTotal}
			</span>
			<button class="pagination__arrow pagination__arrow--right non-selectable"
				@click=${callback}
				value="1"
				?disabled=${pageCountCurrent >= pageCountTotal}
			>◄</button>
			<button class="pagination__arrow pagination__arrow--right non-selectable"
				@click=${callback}
				value="3"
				?disabled=${pageCountCurrent + 2 >= pageCountTotal}
			>◄◄</button>
		</div>
	`;
};