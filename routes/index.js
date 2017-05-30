const express = require("express");
const router = express.Router();
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });
const { userController, sessionController } = require("../controllers");
router.use(csrfProtection);

module.exports = (app, mountPoint) => {
  // GET
  router.get("/", (req, res) =>
    res.render("index", {
      message: req.flash("indexMessage"),
      csrfToken: req.csrfToken()
    }));

  router.get("/profile", sessionController.loginRequired, (req, res) => {
    res.render("users/edit", {
      user: req.user,
      message: req.flash("userMessage"),
      csrfToken: req.csrfToken()
    });
  });

  // POST
  router.post("/contact", userController.contact);

  // PUT
  router.put(
    "/profile",
    sessionController.loginRequired,
    userController.updateProfile
  );

  app.use(mountPoint, router);
};
