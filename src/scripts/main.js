// const showdown = window.showdown;
// console.log(showdown);
// let converter = new showdown.Converter();
let clickMenu = false;
const cards = document.querySelector('.cards');

window.onload = () => {
  console.log("loaded");
  document.addEventListener('click', open);
};

function addCards(values) {
  const html = `
    <div class="card">
      <div class="front">
        ${ (values[0]) }
      </div>
      <div class="back">
        ${ (values[1]) }
      </div>
    </div> 
  `
  cards.innerHTML = html;
  const cardElement = document.querySelector('.card');
  cardElement.addEventListener('click', (c) => {
    cardElement.classList.toggle('flipped');
  });
}

async function cardData(url) {
  const re = /https?:\/\/github.com\/([a-zA-Z0-9-]*\/[^!@#$%^&*()_+-={}\[\];:'",<.>/?`~]+\/?)/
  matches = url.match(re);

  let output = '';
  fetch('https://raw.githubusercontent.com/' + matches[1] + '/master/cards.md')
  .then(function(response) {
    return response.text().then(function(text) {
      const values = text.split(/\n/);
      addCards(values);
    });
  });
}


function open() {
  // hide header
  const header = document.querySelector('header');
  header.classList.add('hidden');
  
  // get url 
  const exampleURL = 'https://github.com/Kingston802/Learn';

  // download cards 
  let cardValues = cardData(exampleURL);

  // Reveal first card 
  console.log(cardValues);
  cards.classList.remove('hidden');
  document.removeEventListener('click', open);
};
