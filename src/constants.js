'use strict';

const MAX_ID_LENGTH = 6;
const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const MOCKS_FILE_NAME = `mocks.json`;
const MOCKS_DB_FILE_NAME = `fill-db.sql`;
const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};
const HttpCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const MockFileName = {
  SENTENCES: `sentences.txt`,
  TITLES: `titles.txt`,
  CATEGORIES: `categories.txt`,
  COMMENTS: `comments.txt`,
};

const OfferSumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const OfferPictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const OfferType = {
  OFFER: {
    id: 1,
    title: `offer`
  },
  SALE: {
    id: 2,
    title: `sale`
  },
};

const USERS = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  },
  {
    email: `popov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Василий`,
    lastName: `Васильев`,
    avatar: `avatar3.jpg`
  },
];

module.exports = {
  MAX_ID_LENGTH,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  MOCKS_FILE_NAME,
  MOCKS_DB_FILE_NAME,
  ExitCode,
  HttpCode,
  Env,
  MockFileName,
  OfferSumRestrict,
  OfferPictureRestrict,
  OfferType,
  USERS,
};
