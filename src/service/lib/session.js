'use strict';

const session = require(`express-session`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const {SESSION_SECRET} = process.env;

const somethingIsNotDefined = [SESSION_SECRET].includes(undefined);

if (somethingIsNotDefined) {
  throw new Error(`One or more environmental variables are not defined`);
}

const createSessionStore = (sequelize) => (
  new SequelizeStore({
    db: sequelize,
    expiration: 180000,
    checkExpirationInterval: 60000,
  })
);

module.exports = (sequelize) => {
  return session({
    secret: SESSION_SECRET,
    store: createSessionStore(sequelize),
    resave: false,
    proxy: true,
    saveUninitialized: false,
  });
};
