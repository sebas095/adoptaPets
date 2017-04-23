const express = require('express');
const router = express.Router();
const {sessionController} = require('../controllers');

module.exports = (app, mountPoint) => {
  // GET
  router.get('/newPassword', sessionController.newPassword);
  router.get('/reset/:token', sessionController.resetPassword);

  // POST

  // PUT

  // DELETE

  app.use(mountPoint, router);
};
