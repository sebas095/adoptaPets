const express = require('express');
const router = express.Router();
const {publicationController} = require('../controllers');

module.exports = (app, mountPoint) => {
  // GET
  router.get('/new', publicationController.new);
  router.get('/edit', publicationController.edit);
  router.get('/search', publicationController.search);

  // POST

  // PUT

  // DELETE

  app.use(mountPoint, router);
};
