const express = require("express");
const router = express.Router();
const { userController, sessionController } = require("../controllers");

module.exports = (app, mountPoint) => {
  // GET
  router.get("/", (req, res) =>
    res.render("index", {
      message: req.flash("indexMessage")
    }));

  router.get("/profile", sessionController.loginRequired, (req, res) => {
    res.render("users/edit", {
      user: req.user,
      message: req.flash("userMessage")
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
