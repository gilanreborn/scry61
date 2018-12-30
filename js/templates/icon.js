import { html, svg, render } from 'https://unpkg.com/lit-html?module';

export default function icon(name) {
	const paths = (symbol) => {
		switch (symbol) {
			case 'W': return '/assets/svgs/W.svg';
			case 'U': return '/assets/svgs/U.svg';
			case 'B': return '/assets/svgs/B.svg';
			case 'R': return '/assets/svgs/R.svg';
			case 'G': return '/assets/svgs/G.svg';
			case 'C': return '/assets/svgs/C.svg'; // colorless mana
			case 'S': return '/assets/svgs/S.svg'; // snow mana
			case 'E': return '/assets/svgs/E.svg'; // energy symbol
			case 'T': return '/assets/svgs/T.svg'; // tap symbol
			case 'Q': return '/assets/svgs/Q.svg'; // untap symbol
			case 'X': return '/assets/svgs/X.svg';
			case '0': return '/assets/svgs/0.svg';
			case '1': return '/assets/svgs/1.svg';
			case '2': return '/assets/svgs/2.svg';
			case '3': return '/assets/svgs/3.svg';
			case '4': return '/assets/svgs/4.svg';
			case '5': return '/assets/svgs/5.svg';
			case '6': return '/assets/svgs/6.svg';
			case '7': return '/assets/svgs/7.svg';
			case '8': return '/assets/svgs/8.svg';
			case '9': return '/assets/svgs/9.svg';
			case '10': return '/assets/svgs/10.svg';
			case '11': return '/assets/svgs/11.svg';
			case '12': return '/assets/svgs/12.svg';
			case '13': return '/assets/svgs/13.svg';
			case '14': return '/assets/svgs/14.svg';
			case '15': return '/assets/svgs/15.svg';
			case '20': return '/assets/svgs/20.svg';
			// lorwyn costs
			case '2/W': return '/assets/svgs/2W.svg';
			case '2/U': return '/assets/svgs/2U.svg';
			case '2/B': return '/assets/svgs/2B.svg';
			case '2/R': return '/assets/svgs/2R.svg';
			case '2/G': return '/assets/svgs/2G.svg';
			// split mana
			case 'W/U': return '/assets/svgs/WU.svg';
			case 'W/B': return '/assets/svgs/WB.svg';
			case 'U/R': return '/assets/svgs/UR.svg';
			case 'U/B': return '/assets/svgs/UB.svg';
			case 'B/G': return '/assets/svgs/BG.svg';
			case 'B/R': return '/assets/svgs/BR.svg';
			case 'R/G': return '/assets/svgs/RG.svg';
			case 'R/W': return '/assets/svgs/RW.svg';
			case 'G/U': return '/assets/svgs/GU.svg';
			case 'G/W': return '/assets/svgs/GW.svg';
			case 'W/G': return '/assets/svgs/GW.svg';
			// phyrexian mana
			case 'W/P': return '/assets/svgs/WP.svg';
			case 'U/P': return '/assets/svgs/UP.svg';
			case 'B/P': return '/assets/svgs/BP.svg';
			case 'R/P': return '/assets/svgs/RP.svg';
			case 'G/P': return '/assets/svgs/GP.svg';
			// rarity images
			case 'Common':      return 'https://cdn4.iconfinder.com/data/icons/free-social-media-icons/48/Black_button.png';
			case 'Uncommon':    return 'https://cdn4.iconfinder.com/data/icons/free-social-media-icons/16/Silver_button.png';
			case 'Rare':        return 'https://cdn4.iconfinder.com/data/icons/free-social-media-icons/16/Yellow_button.png';
			case 'Mythic Rare': return 'https://cdn4.iconfinder.com/data/icons/free-social-media-icons/16/Orange_button.png';
			case 'Special':     return 'https://magidex.com/extstatic/symbol/set/TSP/s.svg';
			// type symbols
			case 'Artifact':      return '/assets/svgs/type_artifact.svg';
			case 'Creature':      return '/assets/svgs/type_creature.svg';
			case 'Enchantment':   return '/assets/svgs/type_enchantment.svg';
			case 'Land':          return '/assets/svgs/type_land.svg';
			case 'Instant':       return '/assets/svgs/type_instant.svg';
			case 'Planeswalker':  return '/assets/svgs/type_planeswalker.svg';
			case 'Sorcery':       return '/assets/svgs/type_sorcery.svg';
			default: return false;
		}
	};

	const src = paths(name);
	if ( src ) {
		return html`<img class="icon" src=${src} />`;
	} else {
		return html`<span>${name}</span>`;
	}
}


// const style = {
//   backgroundColor: 'transparent',
//   height: '15px',
//   width: '15px',
//   margin: '0 0 -2px 0',
// }
