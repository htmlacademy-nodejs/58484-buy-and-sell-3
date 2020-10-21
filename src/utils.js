'use strict';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (array) => {
  array.forEach((item, index) => {
    const randomPosition = Math.floor(Math.random() * index);
    [array[index], array[randomPosition]] = [array[randomPosition], array[index]];
  })

  return array;
};

const addLeadZero = (int) => {
  return (int < 10) ? `0${int}` : `${int}`;
};

const makeUniqueArray = (array) => {
  const set = new Set(array);
  return Array.from(set);
};

const getRandomItem = (array) => {
  const randomIndex = getRandomInt(0, array.length - 1);
  return array[randomIndex];
};

const getRandomItems = (array, min = 0, max = array.length) => {
  const items = Array(getRandomInt(min, max))
    .fill(``)
    .map(() => array[getRandomInt(min, max)]);

  return makeUniqueArray(items);
};

module.exports = {
  getRandomInt,
  shuffle,
  addLeadZero,
  makeUniqueArray,
  getRandomItem,
  getRandomItems,
};
