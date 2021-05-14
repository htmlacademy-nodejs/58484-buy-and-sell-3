'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const bodyValidator = require(`../middlewares/body-validator`);
const paramValidator = require(`../middlewares/param-validator`);
const offerExist = require(`../middlewares/offer-exist`);
const commentExist = require(`../middlewares/comment-exist`);
const offerSchema = require(`../joi-shemas/offer-schema`);
const commentSchema = require(`../joi-shemas/comment-schema`);
const idSchema = require(`../joi-shemas/id-schema`);

module.exports = (app, offerService, commentService) => {
  const route = new Router();

  app.use(`/offers`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit, comments} = req.query;
    let offers;

    if (limit || offset) {
      offers = await offerService.findPage({limit, offset});
    } else {
      offers = await offerService.findAll(comments);
    }

    return res
      .status(HttpCode.OK)
      .json(offers);
  });

  route.get(`/:offerId`, [
    paramValidator(idSchema, `offerId`),
    offerExist(offerService)
  ], (req, res) => {
    return res
      .status(HttpCode.OK)
      .json(res.locals.offer);
  });

  route.post(`/`, bodyValidator(offerSchema), async (req, res) => {
    const offer = await offerService.create(req.body);

    return res
      .status(HttpCode.CREATED)
      .json(offer);
  });

  route.put(`/:offerId`, [
    paramValidator(idSchema, `offerId`),
    offerExist(offerService),
    bodyValidator(offerSchema)
  ], async (req, res) => {
    const {offerId} = req.params;
    const offer = await offerService.update(offerId, req.body);

    return res
      .status(HttpCode.OK)
      .json(offer);
  });

  route.delete(`/:offerId`, [
    paramValidator(idSchema, `offerId`),
    offerExist(offerService)
  ], async (req, res) => {
    const {offerId} = req.params;
    const offer = await offerService.drop(offerId);

    return res
      .status(HttpCode.OK)
      .json(offer);
  });

  route.get(`/:offerId/comments`, [
    paramValidator(idSchema, `offerId`),
    offerExist(offerService)
  ], async (req, res) => {
    const offer = res.locals.offer;
    const comments = await commentService.findAll(offer.id);

    return res
      .status(HttpCode.OK)
      .json(comments);
  });

  route.post(`/:offerId/comments`, [
    paramValidator(idSchema, `offerId`),
    offerExist(offerService),
    bodyValidator(commentSchema)
  ], async (req, res) => {
    const newComment = req.body;
    const offer = res.locals.offer;
    const comment = await commentService.create(offer.id, newComment);

    return res
      .status(HttpCode.CREATED)
      .json(comment);
  });

  route.delete(`/:offerId/comments/:commentId`, [
    paramValidator(idSchema, `offerId`),
    paramValidator(idSchema, `commentId`),
    offerExist(offerService),
    commentExist(commentService)
  ], async (req, res) => {
    const {commentId} = req.params;
    const dropComment = await commentService.drop(commentId);

    return res
      .status(HttpCode.OK)
      .json(dropComment);
  });

};
