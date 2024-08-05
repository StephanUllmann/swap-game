import './style.css';
import { initPWA } from './pwa.ts';

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <h1 class="won">Level beaten!</h1>
  <div class="game">
    <div class="field" data-num="0"></div>
    <div class="field" data-num="1"></div>
    <div class="field" data-num="2"></div>
    <div class="field" data-num="3"></div>
    <div class="field" data-num="4"></div>
    <div class="field" data-num="5"></div>
    <div class="field" data-num="6"></div>
    <div class="field" data-num="7"></div>
    <div class="field" data-num="8"></div>
  </div>
  <h1>Level <span id="level-indicator">1</span></h1>
  <div
    id="pwa-toast"
    role="alert"
    aria-labelledby="toast-message"
  >
    <div class="message">
      <span id="toast-message"></span>
    </div>
    <div class="buttons">
        <button id="pwa-refresh" type="button">
          Reload
        </button>
        <button id="pwa-close" type="button">
          Close
        </button>
    </div>
  </div>
`;

initPWA(app);

type level = number[];

import levels from './data/levels.json';
const gameField = document.querySelector('.game') as HTMLDivElement;
const winIndicator = document.querySelector('.won')!;
const levelIndicator = document.getElementById('level-indicator')!;
let levelNum = 0;

const createLevel = function (level: level) {
  for (let i = 0; i < level.length; i++) {
    if (level[i]) gameField.children[i].classList.add('field--swapped');
    else gameField.children[i].classList.remove('field--swapped');
  }
};

const displayWin = function () {
  winIndicator.classList.add('won--active');
  setTimeout(() => winIndicator.classList.remove('won--active'), 2010);
  levelIndicator.textContent = String(+levelIndicator.textContent! + 1);
};

const checkWin = function () {
  const fieldsNum = gameField.children.length;
  let num = 0;
  for (let i = 0; i < fieldsNum; i++) {
    if (gameField.children[i].classList.contains('field--swapped')) num++;
  }
  if (num > fieldsNum / 2) gameField.style.outlineColor = 'teal';
  else gameField.style.outlineColor = 'blueviolet';
  if (num === fieldsNum) {
    displayWin();
    setTimeout(() => {
      if (levels.length > levelNum + 1) {
        levelNum++;
        createLevel(levels[levelNum]);
      } else {
        // random level
        const random = Array.from({ length: 9 }, () => {
          const isZero = Math.random() < 0.5;
          return isZero ? 0 : 1;
        });
        createLevel(random);
      }
    }, 1500);
  }
};

const handleClick = function (e: MouseEvent) {
  if (!levels.length) return;
  if (!e.target) return;
  const field = e.target as HTMLDivElement;
  if (!field.classList.contains('field')) return;
  const fieldNum = +field.dataset['num']!;
  field.classList.toggle('field--swapped');
  gameField.children[fieldNum - 3]?.classList.toggle('field--swapped');
  gameField.children[fieldNum + 3]?.classList.toggle('field--swapped');
  if (fieldNum !== 2 && fieldNum !== 5 && fieldNum !== 8)
    gameField.children[fieldNum + 1]?.classList.toggle('field--swapped');
  if (fieldNum !== 0 && fieldNum !== 3 && fieldNum !== 6)
    gameField.children[fieldNum - 1]?.classList.toggle('field--swapped');
  checkWin();
};

export const startGame = function () {
  gameField.addEventListener('click', handleClick);
  createLevel(levels[levelNum]);
  checkWin();
};

window.addEventListener('DOMContentLoaded', startGame);
