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
