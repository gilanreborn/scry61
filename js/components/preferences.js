import { q } from '../util/utils.js';
import Component from './component.js';

export default class PreferenceManager extends Component {
	constructor(options) {
		super(options);

	}

	update(props) {
		const { primary, secondary, tertiary } = props.preferences.themeColor;
		q('meta[name="theme-color"]')[0].setAttribute('content', primary);
		$container.style.setProperty('--theme-color-1', primary);
		$container.style.setProperty('--theme-color-2', secondary);
		$container.style.setProperty('--theme-color-3', tertiary);
	}
}