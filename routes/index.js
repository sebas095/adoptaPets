const express = require('express');
const router = express.Router();

module.exports = (app, mountPoint) => {
  // GET
  router.get('/', (req, res) => res.render('index'));

  app.use(mountPoint, router);
};
