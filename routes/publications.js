const express = require("express");
const router = express.Router();
const { sessionController, publicationController } = require("../controllers");

module.exports = (app, mountPoint) => {
  // GET
  router.get("/", publicationController.getPublications);
  router.get("/me", publicationController.getMyPublications);

  router.get(
    "/new",
    sessionController.loginRequired,
    publicationController.new
  );

  router.get(
    "/admin",
    sessionController.loginRequired,
    publicationController.admin
  );

  router.get("/search", publicationController.search);

  router.get(
    "/admin/:id/edit",
    sessionController.loginRequired,
    publicationController.adminEdit
  );

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
    "/admin/:id/edit",
    sessionController.loginRequired,
    publicationController.adminUpdate
  );

  router.put(
    "/:id/edit",
    sessionController.loginRequired,
    publicationController.update
  );

  // DELETE
  router.delete(
    "/admin/:id/delete",
    sessionController.loginRequired,
    publicationController.adminDeleteImg
  );

  router.delete(
    "/admin/:id",
    sessionController.loginRequired,
    publicationController.adminDelete
  );

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
