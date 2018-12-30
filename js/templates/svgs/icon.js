import chevron from './fa_chevron_down.js';

export default function svgIcon(name) {
	switch (name) {
		case 'chevron': return chevron;
		default: return '';
	}
}