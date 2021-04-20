'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    const {query = ``} = req.query;

    if (!query) {
      res
        .status(HttpCode.BAD_REQUEST)
        .json([]);
      return;
    }

    const result = await service.findAll(query);
    const status = result.length > 0 ? HttpCode.OK : HttpCode.NOT_FOUND;

    res
      .status(status)
      .json(result);
  });
};
