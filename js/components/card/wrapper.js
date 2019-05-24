import { html, svg, render } from '/node_modules/lit-html/lit-html.js';

export default function card({ card, view, printing, collapsed = false }) {

	return html`
    <div class="card__wrapper draggable"
      tabindex="0"
      draggable="true"
      title="${card.name}"
    >
      <div class="card__actions"></div>
    </div>
	`;
}