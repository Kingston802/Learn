const showdown = window.showdown;
let converter = new showdown.Converter();
let clickMenu = false;
let currentCard = 0;
let values = [];
let github_url = '';
let formData = null;
const card = document.querySelector('.card');
const header = document.querySelector('header');
const form = document.querySelector('form');

window.onload = () => {
  document.getElementById("url").addEventListener("keypress", (event) => {
    if(event.key === "Enter"){
        open();
    }
    // on form submission, prevent default
    event.preventDefault();
  });
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
  // const exampleURL = 'https://github.com/Kingston802/Learn';
  github_url = document.getElementById('url').value;


  // download and open cards 
  cardData(github_url);

  card.addEventListener('click', (c) => {
    if(!card.classList.toggle('flipped')) {
      currentCard += 1;
      updateCard();
    }
  });
};

