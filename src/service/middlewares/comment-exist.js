'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (service) => async (req, res, next) => {
  const offer = res.locals.offer;
  const {commentId} = req.params;
  const comment = await service.findOne(offer, commentId);

  if (!comment) {
    return res.status(HttpCode.NOT_FOUND)
      .send(`Comment with ${commentId} not found`);
  }

  res.locals.comment = comment;
  return next();
};
