const Publication = require("../models/publication");
const uuid = require("uuid");
const multer = require("multer");
const {
  imageFilter,
  renameFiles,
  deleteFiles,
  getDistance
} = require("../helpers/utils");
const upload = multer({
  dest: "public/uploads",
  fileFilter: imageFilter
}).array("pet.photos", 5);

// GET /publications/new -- Publication form
exports.new = (req, res) => {
  if (req.user.state.includes("1") || req.user.state.includes("2")) {
    res.render("publications/new");
  } else {
    res.redirect("/");
  }
};

// POST /publications/new -- Create a new publication
exports.create = (req, res) => {
  if (req.user.state.includes("1") || req.user.state.includes("2")) {
    upload(req, res, err => {
      if (err) {
        console.log(err);
        req.flash(
          "indexMessage",
          "Hubo problemas guardando la publicación, intenta de nuevo"
        );
        res.redirect("/");
      } else {
        const pet = {
          color: req.body["pet.color"].toUpperCase(),
          size: req.body["pet.size"].toUpperCase(),
          name: req.body["pet.name"].toUpperCase(),
          age: req.body["pet.age"],
          gender: req.body["pet.gender"]
        };

        const publication = {
          uid: uuid.v4(),
          phone: req.body["phone"],
          description: req.body["description"],
          email: req.body["email"],
          createdBy: "sebas_tian_95@hotmail.com",
          address: req.body["address"],
          lat: req.body["lat"],
          lng: req.body["lng"],
          photos: [],
          features: pet
        };

        const pub = new Publication(publication);
        if (req.files) {
          renameFiles(pub._id, req.files, (err, photos) => {
            pub.photos = photos;
            pub.save(err => {
              if (err) {
                console.log(err);
                req.flash(
                  "indexMessage",
                  "Hubo problemas guardando la publicación, intenta de nuevo"
                );
                res.redirect("/");
              } else {
                req.flash(
                  "indexMessage",
                  "Su publicación ha sido creada exitosamente"
                );
                res.redirect("/");
              }
            });
          });
        } else {
          pub.save(err => {
            if (err) {
              console.log(err);
              req.flash(
                "indexMessage",
                "Hubo problemas guardando la publicación, intenta de nuevo"
              );
              res.redirect("/");
            } else {
              req.flash(
                "indexMessage",
                "Su publicación ha sido creada exitosamente"
              );
              res.redirect("/");
            }
          });
        }
      }
    });
  } else {
    res.redirect("/");
  }
};

// GET /publications/:id/edit -- Edit publication form
exports.edit = (req, res) => {
  if (req.user.state.includes("1") || req.user.state.includes("2")) {
    const { id } = req.params;
    Publication.findById(id, (err, data) => {
      if (err) {
        console.log(err);
        req.flash(
          "indexMessage",
          "Hubo problemas buscando la publicación, intenta más tarde"
        );
        res.redirect("/");
      } else if (!data) {
        req.flash(
          "indexMessage",
          "La publicación solicitada no se encuentra registrada"
        );
        res.redirect("/");
      } else {
        res.render("publications/edit", {
          publication: data,
          message: req.flash("pubMessage")
        });
      }
    });
  } else {
    res.redirect("/");
  }
};

// PUT /publications/:id/edit -- Edit publication
exports.update = (req, res) => {
  if (req.user.state.includes("1") || req.user.state.includes("2")) {
    upload(req, res, err => {
      if (err) {
        console.log(err);
        req.flash(
          "indexMessage",
          "Hubo problemas guardando la publicación, intenta de nuevo"
        );
        res.redirect("/");
      } else {
        const { id } = req.params;

        const pet = {
          color: req.body["pet.color"].toUpperCase(),
          size: req.body["pet.size"].toUpperCase(),
          name: req.body["pet.name"].toUpperCase(),
          age: req.body["pet.age"],
          gender: req.body["pet.gender"]
        };

        const publication = {
          phone: req.body["phone"],
          description: req.body["description"],
          email: req.body["email"],
          createdBy: "sebas_tian_95@hotmail.com",
          address: req.body["address"],
          lat: req.body["lat"],
          lng: req.body["lng"],
          features: pet
        };

        Publication.findByIdAndUpdate(
          id,
          publication,
          { new: true },
          (err, data) => {
            if (err) {
              console.log(err);
              req.flash(
                "indexMessage",
                "Hubo problemas actualizando los datos " +
                  "de la publicación, intenta más tarde"
              );
              res.redirect("/");
            } else {
              if (req.files) {
                if (data.photos.length > 0) {
                  deleteFiles(data.photos, err => {
                    if (err) {
                      console.log(err);
                      req.flash(
                        "indexMessage",
                        "Hubo problemas actualizando los datos " +
                          "de la publicación, intenta más tarde"
                      );
                      res.redirect("/");
                    } else {
                      renameFiles(data._id, req.files, (err, photos) => {
                        if (err) {
                          console.log(err);
                          req.flash(
                            "indexMessage",
                            "Hubo problemas actualizando los datos " +
                              "de la publicación, intenta más tarde"
                          );
                          res.redirect("/");
                        } else {
                          Publication.findByIdAndUpdate(
                            id,
                            { photos },
                            { new: true },
                            (err, pub) => {
                              if (err) {
                                console.log(err);
                                req.flash(
                                  "indexMessage",
                                  "Hubo problemas actualizando los datos " +
                                    "de la publicación, intenta más tarde"
                                );
                                return res.redirect("/");
                              }
                              req.flash(
                                "pubMessage",
                                "Los datos han sido actualizados exitosamente"
                              );
                              res.redirect(`/publications/${id}/edit`);
                            }
                          );
                        }
                      });
                    }
                  });
                } else {
                  renameFiles(data._id, req.files, (err, photos) => {
                    if (err) {
                      console.log(err);
                      req.flash(
                        "indexMessage",
                        "Hubo problemas actualizando los datos " +
                          "de la publicación, intenta más tarde"
                      );
                      res.redirect("/");
                    } else {
                      Publication.findByIdAndUpdate(
                        id,
                        { photos },
                        { new: true },
                        (err, pub) => {
                          if (err) {
                            console.log(err);
                            req.flash(
                              "indexMessage",
                              "Hubo problemas actualizando los datos " +
                                "de la publicación, intenta más tarde"
                            );
                            return res.redirect("/");
                          }
                          req.flash(
                            "pubMessage",
                            "Los datos han sido actualizados exitosamente"
                          );
                          res.redirect(`/publications/${id}/edit`);
                        }
                      );
                    }
                  });
                }
              } else {
                req.flash(
                  "pubMessage",
                  "Los datos han sido actualizados exitosamente"
                );
                res.redirect(`/publications/${id}/edit`);
              }
            }
          }
        );
      }
    });
  } else {
    res.redirect("/");
  }
};

// GET /publications/:id -- Get a specific publication
exports.show = (req, res) => {
  const { id } = req.params;
  Publication.findById(id, (err, data) => {
    if (err) {
      console.log(err);
      req.flash(
        "indexMessage",
        "Hubo problemas buscando la publicación, intenta más tarde"
      );
      res.redirect("/");
    } else if (!data) {
      req.flash(
        "indexMessage",
        "La publicación solicitada no se encuentra registrada"
      );
      res.redirect("/");
    } else {
      res.render("publications/show", { publication: data });
    }
  });
};

// GET /publications -- All publications
exports.getPublications = (req, res) => {
  Publication.find({}, (err, data) => {
    if (err) {
      console.log(err);
      req.flash(
        "indexMessage",
        "Hubo problemas obteniendo los datos de las publicaciones, " +
          "intenta de nuevo"
      );
      res.redirect("/");
    } else if (data.length > 0) {
      res.render("publications/all", { publications: data });
    } else {
      req.flash("indexMessage", "No hay publicaciones disponibles");
      res.redirect("/");
    }
  });
};

// GET /publications/search -- Search publications
exports.search = (req, res) => {
  if (req.query.lat1 && req.query.lng1) {
    const lat1 = parseFloat(req.query.lat1);
    const lon1 = parseFloat(req.query.lng1);
    const dist = req.query.dist ? Number(req.query.dist) : 10;
    let filter = {};
    if (req.query.color) filter.color = req.query.color.toUpperCase();
    if (req.query.size) filter.size = req.query.size.toUpperCase();
    if (req.query.age) filter.age = req.query.age;
    if (req.query.gender) filter.gender = req.query.gender;

    Publication.find({}, (err, data) => {
      if (err) {
        console.log(err);
        req.flash(
          "indexMessage",
          "Hubo problemas obteniendo los datos de las publicaciones, " +
            "intenta de nuevo"
        );
        res.redirect("/");
      } else if (data.length > 0) {
        let pubs = data.filter(pub => {
          const distance = getDistance(lat1, lon1, pub.lat, pub.lng);
          return distance <= dist;
        });
        pubs = pubs.filter(pub => {
          let flag = true;
          const keys = Object.keys(filter);
          for (let i = 0; i < keys.length; i++) {
            if (filter[keys[i]] !== pub.features[keys[i]]) {
              flag = false;
              break;
            }
          }
          return flag;
        });
        res.render("publications/search", { publications: pubs });
      } else {
        res.render("publications/search", {
          message: "No hay publicaciones disponibles"
        });
      }
    });
  } else {
    res.render("publications/search");
  }
};

// DELETE /publications/:id -- Delete a specific publication
exports.delete = (req, res) => {
  if (req.user.state.includes("1") || req.user.state.includes("2")) {
    const { id } = req.params;
    Publication.findByIdAndRemove(id, (err, data) => {
      if (err) {
        console.log(err);
        req.flash(
          "indexMessage",
          "Hubo problemas para eliminar la publicación, intenta más tarde"
        );
        res.redirect("/");
      } else {
        deleteFiles(data.photos, err => {
          if (err) {
            req.flash(
              "indexMessage",
              "Hubo problemas para eliminar la publicación, intenta más tarde"
            );
            return res.redirect("/");
          }
          req.flash(
            "indexMessage",
            "La publicación ha sido eliminada exitosamente"
          );
          res.redirect("/");
        });
      }
    });
  } else {
    res.redirect("/");
  }
};

exports.deleteImg = (req, res) => {
  if (req.user.state.includes("1") || req.user.state.includes("2")) {
    const { id } = req.params;
    Publication.findById(id, (err, data) => {
      if (err) {
        console.log(err);
        req.flash(
          "indexMessage",
          "Hubo problemas para eliminar la publicación, intenta más tarde"
        );
        res.redirect("/");
      } else {
        const index = data.photos.indexOf(req.body.photo);
        if (index > -1) {
          data.photos.splice(index, 1);
          const { photos } = data;
          Publication.findByIdAndUpdate(
            id,
            { photos },
            { new: true },
            (err, pub) => {
              if (err) {
                console.log(err);
                req.flash(
                  "indexMessage",
                  "Hubo problemas actualizando los datos " +
                    "de la publicación, intenta más tarde"
                );
                return res.redirect("/");
              }
              deleteFiles([req.body.photo], err => {
                if (err) {
                  console.log(err);
                  req.flash(
                    "indexMessage",
                    "Hubo problemas actualizando los datos " +
                      "de la publicación, intenta más tarde"
                  );
                  return res.redirect("/");
                }
                req.flash(
                  "pubMessage",
                  "Los datos han sido actualizados exitosamente"
                );
                res.redirect(`/publications/${id}/edit`);
              });
            }
          );
        }
      }
    });
  } else {
    res.redirect("/");
  }
};
