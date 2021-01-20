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
let clickMenu = false;
let currentCard = 0;
let values = [];
let github_url = '';
let formData = null;
let flipped = false;
const card = document.querySelector('.card');
const header = document.querySelector('header');
const form = document.querySelector('form');

window.onload = () => {
  document.getElementById("url").addEventListener("keypress", (event) => {
    // on form submission, prevent default
    event.preventDefault();
    if(event.key === "Enter"){
        open();
    }
  });
};

function updateCard() {
  console.log(currentCard);
  if (currentCard > (values.length-1)/2) { 
    // reached the end of the array
    window.alert('cards finished!');
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
    <img class="flip" src="img/flip.svg">
  `
  card.innerHTML = html;
}

async function cardData(url) {
  const re = /https?:\/\/github.com\/([a-zA-Z0-9-]*\/[^!@#$%^&*()_+-={}\[\];:'",<.>/?`~]+\/?)/
  matches = url.match(re);

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

      // preprocess text 
      // TODO: add support for multiline LaTeX expressions
      // let tempArr = [];
      // let stack = [];
      // values.forEach((val) => {
      //   console.log(stack);
      //   if (stack.length > 1 && val === '```') {
      //     // push whole expression into tempArr
      //     stack.push(val);
      //     tempArr.push(stack.join('\n'));
      //     // clear stack
      //     stack = [];
      //   } else if (val.includes('```') || (stack.length > 0)) {
      //     console.log('IN AN EXPRESSION');
      //     stack.push(val);
      //   } else {
      //     tempArr.push(val);
      //   }
      // });

      // values = tempArr;
      // console.log(values);

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
    // on main card click
    if(flipped) {
      // if card is flipped
      // move to next card
      flipped = false;
      currentCard += 1;
      updateCard();
      card.classList.remove('flipped');
    } else {
      // if card is not flipped
      // flip and add flipback button
      flipped = true;
      card.classList.add('flipped');
      document.querySelector('.flip').style.visibility = 'visible';
      document.querySelector('.flip').addEventListener('click', (c) => {
        c.stopPropagation();
        card.classList.toggle('flipped');
      });
    }
  });
};

