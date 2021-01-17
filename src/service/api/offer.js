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

  route.get(`/`, (req, res) => {
    const offers = offerService.findAll();
    res
      .status(HttpCode.OK)
      .json(offers);
  });

  route.get(`/:offerId`, offerExist(offerService), (req, res) => {
    return res
      .status(HttpCode.OK)
      .json(res.locals.offer);
  });

  route.post(`/`, offerValidator, (req, res) => {
    const offer = offerService.create(req.body);

    return res
      .status(HttpCode.CREATED)
      .json(offer);
  });

  route.put(`/:offerId`, [offerExist(offerService), offerValidator], (req, res) => {
    const {offerId} = req.params;
    const offer = offerService.update(offerId, req.body);

    return res
      .status(HttpCode.OK)
      .json(offer);
  });

  route.delete(`/:offerId`, offerExist(offerService), (req, res) => {
    const {offerId} = req.params;
    const offer = offerService.drop(offerId);

    return res
      .status(HttpCode.OK)
      .json(offer);
  });

  route.get(`/:offerId/comments`, offerExist(offerService), (req, res) => {
    const offer = res.locals.offer;
    const comments = commentService.findAll(offer);

    return res
      .status(HttpCode.OK)
      .json(comments);
  });

  route.post(`/:offerId/comments`, [offerExist(offerService), commentValidator], (req, res) => {
    const newComment = req.body;
    const offer = res.locals.offer;
    const comment = commentService.create(offer, newComment);

    return res
      .status(HttpCode.CREATED)
      .json(comment);
  });

  route.delete(`/:offerId/comments/:commentId`, [offerExist(offerService), commentExist(commentService)], (req, res) => {
    const {commentId} = req.params;
    const offer = res.locals.offer;
    const dropComment = commentService.drop(offer, commentId);

    return res
      .status(HttpCode.OK)
      .json(dropComment);
  });

};
