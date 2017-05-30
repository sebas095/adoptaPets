const express = require("express");
const router = express.Router();
// const csrf = require("csurf");
// const csrfProtection = csrf({ cookie: true });
const { sessionController } = require("../controllers");
// router.use(csrfProtection);

module.exports = (app, mountPoint) => {
  // GET
  router.get("/newPassword", sessionController.newPassword);
  router.get("/reset/:token", sessionController.resetPassword);

  // POST
  router.post("/emailRecovery", sessionController.sendEmail);

  // PUT
  router.put("/reset/:token", sessionController.changePassword);

  app.use(mountPoint, router);
};
