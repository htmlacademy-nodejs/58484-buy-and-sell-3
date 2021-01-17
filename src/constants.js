'use strict';

const MAX_ID_LENGTH = 6;
const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const MOCKS_FILE_NAME = `mocks.json`;
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

module.exports = {
  MAX_ID_LENGTH,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  MOCKS_FILE_NAME,
  ExitCode,
  HttpCode,
  Env,
};
