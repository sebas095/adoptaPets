const express = require("express");
const router = express.Router();
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });
const { sessionController, publicationController } = require("../controllers");
router.use(csrfProtection);

module.exports = (app, mountPoint) => {
  // GET
  router.get("/", publicationController.getPublications);
  router.get("/me", publicationController.getMyPublications);

  router.get(
    "/new",
    sessionController.loginRequired,
    publicationController.new
  );

  router.get("/search", publicationController.search);

  router.get(
    "/:id/edit",
    sessionController.loginRequired,
    publicationController.edit
  );

  router.get("/:id", publicationController.show);

  // POST
  router.post(
    "/new",
    sessionController.loginRequired,
    publicationController.create
  );

  // PUT
  router.put(
    "/:id/edit",
    sessionController.loginRequired,
    publicationController.update
  );

  // DELETE
  router.delete(
    "/:id/delete",
    sessionController.loginRequired,
    publicationController.deleteImg
  );
  router.delete(
    "/:id",
    sessionController.loginRequired,
    publicationController.delete
  );

  app.use(mountPoint, router);
};
