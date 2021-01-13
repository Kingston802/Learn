const showdown = window.showdown;
let converter = new showdown.Converter();
let clickMenu = false;
let currentCard = 0;
let values = [];
const card = document.querySelector('.card');
const header = document.querySelector('header');

window.onload = () => {
  // console.log("loaded");
  // document.addEventListener('click', open);
  function submitOnEnter(event){
      if(event.which === 13){
          open();
          event.preventDefault(); // Prevents the addition of a new line in the text field (not needed in a lot of cases)
      }
  }
  document.getElementById("url").addEventListener("keypress", submitOnEnter);
};

function updateCard() {
  console.log(currentCard);
  if (currentCard > (values.length-1)/2) { 
    window.alert('cards finished!');
    return
  }
  let [ front, back ] = [ values[currentCard*2], values[currentCard*2+1] ];
  let html = `
    <div class="front">
      ${ converter.makeHtml(front) }
    </div>
    <div class="back">
      ${ converter.makeHtml(back) }
    </div>
  `
  card.innerHTML = html;
}

async function cardData(url) {
  const re = /https?:\/\/github.com\/([a-zA-Z0-9-]*\/[^!@#$%^&*()_+-={}\[\];:'",<.>/?`~]+\/?)/
  matches = url.match(re);

  fetch('https://raw.githubusercontent.com/' + matches[1] + '/master/cards.md')
  .then(function(response) {
    return response.text().then(function(text) {
      values = text.split(/\n/);

      updateCard();
      card.classList.remove('hidden');
    });
  });

}

function open() {
  document.removeEventListener('click', open);
  // hide header
  header.classList.add('hidden');
  
  // get url 
  const exampleURL = 'https://github.com/Kingston802/Learn';

  // download and open cards 
  cardData(exampleURL);

  card.addEventListener('click', (c) => {
    if(!card.classList.toggle('flipped')) {
      currentCard += 1;
      updateCard();
    }
  });
};

