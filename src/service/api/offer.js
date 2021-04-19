'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const offerValidator = require(`../middlewares/offer-validator`);
const commentValidator = require(`../middlewares/comment-validator`);
const offerExist = require(`../middlewares/offer-exist`);
const commentExist = require(`../middlewares/comment-exist`);

module.exports = (app, offerService, commentService) => {
  const route = new Router();

  app.use(`/offers`, route);

  route.get(`/`, async (req, res) => {
    const {comments} = req.query;
    const offers = await offerService.findAll(comments);

    return res
      .status(HttpCode.OK)
      .json(offers);
  });

  route.get(`/:offerId`, offerExist(offerService), (req, res) => {
    return res
      .status(HttpCode.OK)
      .json(res.locals.offer);
  });

  route.post(`/`, offerValidator, async (req, res) => {
    const offer = await offerService.create(req.body);

    return res
      .status(HttpCode.CREATED)
      .json(offer);
  });

  route.put(`/:offerId`, [offerExist(offerService), offerValidator], async (req, res) => {
    const {offerId} = req.params;
    const offer = await offerService.update(offerId, req.body);

    return res
      .status(HttpCode.OK)
      .json(offer);
  });

  route.delete(`/:offerId`, offerExist(offerService), async (req, res) => {
    const {offerId} = req.params;
    const offer = await offerService.drop(offerId);

    return res
      .status(HttpCode.OK)
      .json(offer);
  });

  route.get(`/:offerId/comments`, offerExist(offerService), async (req, res) => {
    const offer = res.locals.offer;
    const comments = await commentService.findAll(offer.id);

    return res
      .status(HttpCode.OK)
      .json(comments);
  });

  route.post(`/:offerId/comments`, [offerExist(offerService), commentValidator], async (req, res) => {
    const newComment = req.body;
    const offer = res.locals.offer;
    const comment = await commentService.create(offer.id, newComment);

    return res
      .status(HttpCode.CREATED)
      .json(comment);
  });

  route.delete(`/:offerId/comments/:commentId`, [offerExist(offerService), commentExist(commentService)], async (req, res) => {
    const {commentId} = req.params;
    const offer = res.locals.offer;
    const dropComment = await commentService.drop(offer, commentId);

    return res
      .status(HttpCode.OK)
      .json(dropComment);
  });

};
