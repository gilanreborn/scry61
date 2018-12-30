export default function fetchAllSets() {
  return fetch('/AllSets.json', { cache: 'default' })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export function buildCardData() {
  console.log('noop');
}

export function fetchASet() {
  return fetch('https://mtgjson.com/json/SetCodes.json')
    .then(response => response.json())
    .then(setCodes => {
      return fetch(`https://mtgjson.com/json/${setCodes[0]}.json`)
        .then(response => response.json());
    })
    .then(setData => {
      return [setData];
    })
    .catch(err => console.log(err));
}