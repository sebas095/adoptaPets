const express = require('express');
const router = express.Router();
const {publicationController} = require('../controllers');

module.exports = (app, host, mountPoint) => {
  // GET
  router.get('/', publicationController.getPublications);
  router.get('/new', publicationController.new);
  router.get('/search', publicationController.search);
  router.get('/:id/edit', publicationController.edit);
  router.get('/:id', publicationController.show);

  // POST
  router.post('/new', publicationController.create);

  // PUT
  router.put('/:id/edit', publicationController.update);

  // DELETE
  router.delete('/:id', publicationController.delete);

  app.use(host + mountPoint, router);
};
