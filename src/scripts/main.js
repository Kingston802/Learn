const showdown = window.showdown;
const showdownKatex = window.showdownKatex;
const converter = new showdown.Converter({
    extensions: [
      showdownKatex({
        displayMode: true,
        throwOnError: false, // allows katex to fail silently
        delimiters: [
          { left: "$", right: "$", display: false },
          { left: '~', right: '~', display: false, asciimath: true },
        ], 
        // change errorColor to blue
        errorColor: '#1500ff',
      }),
    ],
  });

let currentCard = 0;
let currentAnno = 0;
let values = [];
let github_url = '';
let flipped = false;
const card = document.querySelector('.card');
const header = document.querySelector('header');
const annotationDiv = document.querySelector('.annotations');
const annotations = document.querySelectorAll('.annotations div');

window.onload = () => {
  annotations.forEach((a) => {
    a.addEventListener('click', () => {
      location.href = a.textContent; 
    }); 
  });


  // start changing annotations 
  const DISPLAY_LENGTH = 9000;
  setInterval(changeAnnotation, DISPLAY_LENGTH);
  document.getElementById("url").addEventListener("keypress", (event) => {
    // on form submission, prevent default
    event.preventDefault();
    if(event.key === "Enter"){
        siteOpen();
    }
  });
};

function changeAnnotation() {

  currentAnno += 1;

  if (annotations[currentAnno]) {
    // console.log(annotations);
    if (currentAnno >= 1) {
      annotations[currentAnno-1].classList.add('hidden');
      annotations[currentAnno].classList.remove('hidden');
    } else {
      annotations[annotations.length-1].classList.add('hidden');
      annotations[currentAnno].classList.remove('hidden');
    }
  } else {
    // reached the end 
    currentAnno = 0;
    annotations[annotations.length-1].classList.add('hidden');
    annotations[currentAnno].classList.remove('hidden');
  }
}

function updateCard(direction, create = false) {
  if (!create) {
    currentCard += direction ? 1 : -1;
  }

  flipped = false;
  if (currentCard > (values.length-1)/2) { 
    // reached the end of the array
    window.alert('cards finished!');
    return
  }
  if (currentCard < 0) { 
    // went off the array
    window.alert('wrong way!');
    return
  }
  // set the values for front and back 
  const NUMBER_OF_SIDES = 2;
  let [ front, back ] = [ values[currentCard*NUMBER_OF_SIDES], values[currentCard*NUMBER_OF_SIDES+1] ];
  let html = `
    <div class="front">
      ${ converter.makeHtml(front) }
    </div>
    <div class="back">
      ${ converter.makeHtml(back) }
    </div>
    <img class="button flip" src="img/flip.svg">
    <img class="button last" src="img/back.svg">
  `
  card.innerHTML = html;
  // make sure card is not flipped
  card.classList.remove('flipped');
}

async function cardData(url) {
  const re = /https?:\/\/github.com\/([a-zA-Z0-9-]*\/[^!@#$%^&*()_+-={}\[\];:'",<.>/?`~]+\/?)/
  let matches = url.match(re);

  // handle errors 
  if (!matches) {
    alert('Not a valid url! Make sure you are using the github repository')
    location.reload();
    return
  }

  fetch('https://raw.githubusercontent.com/' + matches[1] + '/master/cards.md')
  .then(function(response) {
    return response.text().then(function(text) {
      values = text.split(/\n/);

      // update with create and a direction that does not matter 
      updateCard(true, true);
      card.classList.remove('hidden');
    });
  });
}

function flipCard() {
    flipped = true;
    card.classList.add('flipped');
    document.querySelector('.flip').style.visibility = 'visible';
    document.querySelector('.last').style.visibility = 'visible';
}

function makeKeys() {
  document.addEventListener('keydown', (e) => {
    switch(e.key) {
      case 'ArrowRight': 
        updateCard(true);
        break;
      case 'ArrowLeft': 
        updateCard(false);
        break;
      case 'ArrowUp': 
        document.querySelector('.flip').click();
        break;
      default:
        // console.log(e.key);
    }
  });
}

function siteOpen() {
  // remove document click 
  document.removeEventListener('click', open);

  // hide header
  header.classList.add('hidden');
  // hide annotations
  annotationDiv.classList.add('hidden');
  
  // get url 
  // const exampleURL = 'https://github.com/Kingston802/Learn';
  github_url = document.getElementById('url').value;

  // download and open cards 
  cardData(github_url);

  card.addEventListener('click', () => {
    // on main card click
    if(flipped) {
      // if card is flipped
      // move to next card
      updateCard(true);
    } else {
      // if card is not flipped
      // flip and add flipback button
      flipCard();
      document.querySelector('.flip').addEventListener('click', (c) => {
        c.stopPropagation();
        card.classList.toggle('flipped');
      });
      document.querySelector('.last').addEventListener('click', (c) => {
        c.stopPropagation();
        updateCard(false);
      });
    }
  });

  // add keypress listener
  makeKeys();
};

