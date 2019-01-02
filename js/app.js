import { q, createStore } from './util/reduxLite.js';
import { rootReducer } from './reducers/root.js';
import { html, render } from 'https://unpkg.com/lit-html?module';
import fetchAllSets from './util/SetFetcher.js';
import Component from './components/component.js';
import Nav from './components/nav.js';
import Accordion from './components/accordion.js';
import Results from './components/results.js';
import Search from './components/search.js';

window.q = q;

export default class UI extends Component {
  constructor(options) {
    super(options);

    this.bindChildren();
    this.fetchCardInfo();
  }

  bindChildren() {
    const nav = new Nav({ $container: q('.header')[0], });
    const search = new Search({ $container: q('.search')[0] });
    const results = new Results({ $container: q('.results')[0] });
    const accordions = q('.accordion').map($container => new Accordion({ $container }));
    this.children = [
      nav,
      search,
      results,
    ];
  }

  fetchCardInfo() {
    const self = this;
    fetchAllSets().then(AllSets => {
      const AllCards = self.buildAllCards(AllSets);
      const dummy = { name: '', type: '', text: '', colors: [], convertedManaCost: 0, rarities: [], };
      const cards = Object.values(AllCards)
        .filter(c => c.name)
        .map(c => Object.assign({}, dummy, c));
      window.cards = cards;
      window.app.dispatch({
        type: 'CARD_FETCH_SUCCESS',
      });
    });
  }

  buildAllCards(AllSets) {
    let AllCards = {};
    Object.values(AllSets).forEach(set => {
      const { code, cards, type, releaseDate, magicCardsInfoCode } = set;
      const setName = set.name;
      cards.forEach(c => {
        AllCards[c.name] = AllCards[c.name] || c;
        AllCards[c.name].sets = AllCards[c.name].sets || [];
        AllCards[c.name].sets.push(code);
        // types
        AllCards[c.name].types = AllCards[c.name].types || [];
        // rarities
        AllCards[c.name].rarities = AllCards[c.name].rarities || [];
        if (type === 'core' || type === 'expansion') {
          AllCards[c.name].rarities.push(c.rarity); // only include rarity values from format-legal sets.
          if (c.rarity === "Basic Land") { AllCards[c.name].rarities.push("Common"); } // treat basics as common
        }
        // formats & legality
        AllCards[c.name].formats = AllCards[c.name].formats || {};
        // AllCards[c.name].formats = this.calculateFormats(c, type, releaseDate, AllCards[c.name].formats);
        // printings, artists, & flavor text
        AllCards[c.name].printings = AllCards[c.name].printings || [];
        AllCards[c.name].printings.push({
          set: code,
          setName: setName,
          artist: c.artist,
          flavor: c.flavor,
          mciSetCode: magicCardsInfoCode,
          mciNumber: c.mciNumber || c.number,
          multiverseId: c.multiverseid,
          rarity: c.rarity,
        });
      });
    });
    return AllCards;
  }

  update(props, prevProps) {
    const { $container } = this;
    const { search, results, deck } = props.preferences.show;
    q('section.search')[0].classList.toggle('show', search);
    q('section.results')[0].classList.toggle('show', results);
    q('section.deck')[0].classList.toggle('show', deck);
    this.children.map(child => child.update(props, prevProps));
  }
}

window.addEventListener('load', function (e) {
  if (false && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(
      registration => console.log('SW registration successful; scope: ', registration.scope),
      err => console.log('ServiceWorker registration failed: ', err)
    );
  }

  var provider = window.app = createStore(rootReducer);
  const view = new UI({ $container: q('#root')[0] });
  provider.subscribe([ view ]);

  app.update(app.state)
});
