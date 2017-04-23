const express = require('express');
const router = express.Router();
const {userController} = require('../controllers');

module.exports = (app, mountPoint) => {
  // GET
  router.get('/register', userController.newUser);

  // POST

  // PUT

  // DELETE

  app.use(mountPoint, router);
};
