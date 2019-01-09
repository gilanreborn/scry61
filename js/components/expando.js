import { html } from 'https://unpkg.com/lit-html?module';

export default function expando({ klass = '', contents }) {
	return html`
		<div class="expando ${klass}">
			<div class="expando-box">
				${contents}
			</div>
			<div class="expando-arrow"
				@click=${e => e.target.parentElement.classList.toggle('open')}
			>
				&#9660;
			</div>
		</div>
	`;
};
