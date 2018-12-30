export default function fetchPrice(card, printing) {
  const root = 'http://magictcgprices.appspot.com/api/cfb/price.json?'
  const cardName = card.name.split(' ').join('%20');
  const setName = printing.setName.split(' ').join('%20');
  const queryString = `cardname=${cardName}&setname=${setName}`;
  const url = root + queryString;

  return fetch(url, { mode: 'no-cors' })
    .then(response => {
      console.log(response);
      return response.json()
    })
    .catch(err => console.log(err));
}
