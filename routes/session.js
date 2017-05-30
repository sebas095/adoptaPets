const express = require("express");
const router = express.Router();
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });
const { sessionController } = require("../controllers");
router.use(csrfProtection);

module.exports = (app, mountPoint, passport) => {
  // GET
  router.get("/login", sessionController.new);

  // POST
  router.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/adopta-pets/profile",
      failureRedirect: "/adopta-pets/session/login",
      failureFlash: true
    })
  );

  // DELETE
  router.delete(
    "/logout",
    sessionController.loginRequired,
    sessionController.destroy
  );

  app.use(mountPoint, router);
};
