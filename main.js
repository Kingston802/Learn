let clickMenu = false;
const cards = document.querySelector('.cards');

window.onload = () => {
  console.log("loaded");
};

let exampleCard = {
  front: 'Car',
  reverse: 'A typically 4 wheeled vehicle'
}

function addCard(card) {
  const html = `
    <div class="card">
      <div class="front">
        ${ card.front }
      </div>
      <div class="back">
        ${ card.reverse }
      </div>
    </div> 
  `
  cards.innerHTML = html;
  const cardElement = document.querySelector('.card');
  cardElement.addEventListener('click', (c) => {
    cardElement.classList.toggle('flipped');
  });
}


function open(e) {
  // Move header to the corner
  const header = document.querySelector('header');
  header.querySelector('h2').classList.add('hidden');
  header.style.margin = '5vh 5vw';

  // Reveal first card 
  addCard(exampleCard);
  cards.classList.remove('hidden');
  document.removeEventListener('click', open);
};
document.addEventListener('click', open);