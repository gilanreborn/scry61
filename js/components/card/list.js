import { html, svg, render } from '/node_modules/lit-html/lit-html.js';
import text from './text.js';
import image from './image.js';

export default function list({ cards, view = 'text', klass = 'card', printing, collapsed = true, imgSize = 300 }) {
  return html`
    <ul class="${klass}__list scrollable">
      ${cards.map(card => html`
        <li class="${klass}__list-item card__container ${klass}__list-item--${view}" style="width: ${imgSize}px">
          ${view === 'text' ? text({ card, collapsed }) : image({ card })}
        </li>
      `)}
    </ul>
  `;
}