'use strict';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const addLeadZero = (int) => {
  return (int < 10) ? `0${int}` : `${int}`;
};

const makeUniqueArray = (array) => {
  const set = new Set(array);
  return Array.from(set);
};

module.exports = {
  getRandomInt,
  shuffle,
  addLeadZero,
  makeUniqueArray,
};
