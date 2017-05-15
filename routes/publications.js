const express = require('express');
const router = express.Router();
const {publicationController} = require('../controllers');

module.exports = (app, mountPoint) => {
  // GET
  router.get('/', publicationController.getPublications);
  router.get('/new', publicationController.new);
  router.get('/search', publicationController.search);
  router.get('/edit', publicationController.edit);
  router.get('/show', publicationController.show);

  // POST
  router.post('/new', publicationController.create);

  // PUT
  router.post('/:id/edit', publicationController.update);

  // DELETE

  app.use(mountPoint, router);
};
