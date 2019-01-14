import { html, svg, render } from 'https://unpkg.com/lit-html?module';
import icon from '../../templates/icon.js';


export default function textBox({ card, printing }) {
  const formatText = (text = '') => {
		return text.split('\n').map(block => {
			const blocks = block.split(/{|}/g).map((t, i) => {
				return i % 2 ? icon(t) : html`<span>${t}</span>`;
			});
			return html`<p>${blocks}</p>`;
		});
  }

  const mapRarityToColor = (rarity) => {
    switch (rarity) {
      case 'Common':      return 'black';
      case 'Uncommon':    return '#99aabc';
      case 'Rare':        return 'gold';
      case 'Mythic Rare': return 'orangered';
      case 'Special':     return 'mediumpurple';;
      default: return 'black';
    }
	}

	const stats = card.power !== undefined || card.toughness !== undefined
		? html`<span>${card.power} / ${card.toughness}</span>`
		: card.loyalty !== undefined ? html`<span>${card.loyalty}</span>`
		: '';

	return html`
		<div class="card__text-box">
			<div class="card__types">
				<span>
					${card.type}
				</span>
				<span>
					${card.printings[0]}
				</span>
			</div>
			<div class="card__text">
				<p class="card__text__main">${formatText(card.text)}</p>
				<blockquote class="card__text__flavor">${card.flavorText}</blockquote>
			</div>
			<div class="card__stats">
				${stats}
			</div>
		</div>
	`;
}