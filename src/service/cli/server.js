'use strict';

const express = require(`express`);

const {ChalkTheme} = require(`./chalk-theme`);
const {success} = ChalkTheme.server;
const {HttpCode} = require(`../../constants`);
const {getLogger} = require(`../lib/logger`);
const offersRouter = require(`./routes/offers`);
const apiRoutes = require(`../api`);

const API_PREFIX = `/api`;
const DEFAULT_PORT = 3000;

const app = express();
const logger = getLogger({name: `api`});

app.use(express.json());

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

app.use(`/offers`, offersRouter);
app.use(API_PREFIX, apiRoutes);

app.use((req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .send(`Not found`);

  logger.error(`Route not found: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error occured on processing request: ${err.message}`);
});

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, () => {
      return logger.info(success(`Ожидаю соединений на ${port}`));
    });

  }
};
