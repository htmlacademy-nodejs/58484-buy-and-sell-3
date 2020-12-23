'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {
  create(offer, comment) {
    const newComment = Object.assign({id: nanoid(MAX_ID_LENGTH)}, comment);
    offer.comments.push(newComment);

    return newComment;
  }

  findAll(offer) {
    return offer.comments;
  }

  findOne(offer, commentId) {
    return offer.comments.find(({id}) => id === commentId);
  }

  drop(offer, commentId) {
    const dropComment = this.findOne(offer, commentId);
    offer.comments = offer.comments.filter(({id}) => id !== commentId);

    return dropComment;
  }
}

module.exports = CommentService;
