/* eslint-disable */
import 'regenerator-runtime/runtime';
import Game from './game';
import './style.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import domManip from './components/domManip';
import addUser from './components/addUser';
import checkUser from './components/checkUser';
import getScores from './components/getScores';
import sortArray from './components/sortArray';

const dom = domManip();

const {
  newUserContainer,
  loading,
  userInput,
  form,
  addUserButton,
  buttonActions,
  welcomeUser,
  start,
  leaderBoard,
  gameContainer,
  gameButtons,
  menu,
  exit,
  playersList,
  players,
  back,
} = dom;

if (checkUser()) {
  newUserContainer.classList.add('d-none');
  welcomeUser.classList.remove('d-none');
  buttonActions.classList.remove('d-none');
  loading.classList.add('d-none');
  welcomeUser.innerHTML = `Hello ${localStorage.getItem('current_player')}!`;
}

addUserButton.addEventListener('click', (e) => {
  e.preventDefault();
  const nameValue = userInput.value;
  form.reset();
  form.classList.add('d-none');
  loading.classList.remove('d-none');
  if (nameValue !== '') {
    const user = addUser(nameValue);
    setTimeout(() => {
      loading.classList.add('d-none');
      welcomeUser.classList.remove('d-none');
      welcomeUser.innerHTML = `Hello ${user}!`;
      buttonActions.classList.remove('d-none');
    }, 3000);
  }
});

start.addEventListener('click', (e) => {
  e.preventDefault();
  buttonActions.classList.add('d-none');
  gameButtons.classList.remove('d-none');
  gameContainer.classList.remove('d-none');
  window.game = new Game();

  menu.addEventListener('click', (e) => {
    e.preventDefault();
    window.game.destroy();
    const canvas = document.querySelector('canvas');
    canvas.remove();
    window.game = new Game();
  });

  exit.addEventListener('click', (e) => {
    e.preventDefault();
    window.game.destroy();
    const canvas = document.querySelector('canvas');
    canvas.remove();
    buttonActions.classList.remove('d-none');
    gameButtons.classList.add('d-none');
    gameContainer.classList.add('d-none');
  });
});

leaderBoard.addEventListener('click', (e) => {
  e.preventDefault();
  buttonActions.classList.add('d-none');
  loading.classList.remove('d-none');
  playersList.classList.remove('d-none');
  getScores()
  .then(function(array) {

    loading.classList.add('d-none');
    back.classList.remove('d-none');
    while (players.firstChild) {
      players.removeChild(players.lastChild);
    }
    const newArray = sortArray(array);
    for (let i = 0; i < newArray.length; i++) {
      const player = document.createElement('li');
      player.classList.add('list-group-item');
      const user = document.createElement('strong');
      const score = document.createElement('span');
      user.innerHTML = newArray[i].user + ': ';
      score.innerHTML = newArray[i].score;
      player.appendChild(user);
      player.appendChild(score);
      players.appendChild(player);
    }
    
  });
  

  back.addEventListener('click', (e) => {
    e.preventDefault();
    buttonActions.classList.remove('d-none');
    playersList.classList.add('d-none');
    back.classList.add('d-none');
  });
});

// window.game = new Game();
