const express = require("express");
const router = express.Router();
const { sessionController } = require("../controllers");

module.exports = (app, host, mountPoint, passport) => {
  // GET
  router.get("/login", sessionController.new);

  // POST
  router.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile",
      failureRedirect: "/session/login",
      failureFlash: true
    })
  );

  // DELETE
  router.delete(
    "/logout",
    sessionController.loginRequired,
    sessionController.destroy
  );

  app.use(host + mountPoint, router);
};
