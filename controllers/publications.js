const Publication = require("../models/publication");
const uuid = require("uuid");
const multer = require("multer");
const {
  imageFilter,
  renameFiles,
  deleteFiles,
  getDistance,
  paginator
} = require("../helpers/utils");
const upload = multer({
  dest: "public/uploads",
  fileFilter: imageFilter
}).array("pet.photos", 5);

// GET /publications/new -- Publication form
exports.new = (req, res) => {
  if (
    req.user.state.includes("1") ||
    req.user.state.includes("2") ||
    req.user.state.includes("4")
  ) {
    res.render("publications/new", { user: req.user });
  } else {
    res.redirect("/adopta-pets");
  }
};

// POST /publications/new -- Create a new publication
exports.create = (req, res) => {
  if (
    req.user.state.includes("1") ||
    req.user.state.includes("2") ||
    req.user.state.includes("4")
  ) {
    upload(req, res, err => {
      if (err) {
        console.log(err);
        req.flash(
          "indexMessage",
          "Hubo problemas guardando la publicación, intenta de nuevo"
        );
        res.redirect("/adopta-pets");
      } else {
        const pet = {
          color: req.body["pet.color"],
          otherColor: req.body["pet.color"] === "otro"
            ? `${req.body["otherColor"]
                .trim()[0]
                .toUpperCase()}${req.body["otherColor"]
                .slice(1)
                .toLowerCase()
                .trim()}`
            : "",
          size: req.body["pet.size"],
          name: req.body["pet.name"].toUpperCase().trim(),
          age: Number(req.body["pet.age"]),
          time: req.body["pet.time"],
          type: req.body["pet.type"],
          gender: req.body["pet.gender"]
        };

        const publication = {
          uid: uuid.v4(),
          phone: req.body["phone"],
          description: req.body["description"] ? req.body["description"] : "",
          email: req.body["email"],
          createdBy: req.user.email,
          address: req.body["address"],
          lat: req.body["lat"],
          lng: req.body["lng"],
          photos: [],
          features: pet
        };

        const pub = new Publication(publication);
        if (req.files) {
          renameFiles(pub._id, req.files, 0, (err, photos) => {
            pub.photos = photos;
            pub.save(err => {
              if (err) {
                console.log(err);
                req.flash(
                  "indexMessage",
                  "Hubo problemas guardando la publicación, intenta de nuevo"
                );
                res.redirect("/adopta-pets");
              } else {
                req.flash(
                  "indexMessage",
                  "Su publicación ha sido creada exitosamente"
                );
                res.redirect("/adopta-pets");
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
              res.redirect("/adopta-pets");
            } else {
              req.flash(
                "indexMessage",
                "Su publicación ha sido creada exitosamente"
              );
              res.redirect("/adopta-pets");
            }
          });
        }
      }
    });
  } else {
    res.redirect("/adopta-pets");
  }
};

// GET /publications/:id/edit -- Edit publication form
exports.edit = (req, res) => {
  if (
    req.user.state.includes("1") ||
    req.user.state.includes("2") ||
    req.user.state.includes("4")
  ) {
    const { id } = req.params;
    Publication.findOne({ _id: id, createdBy: req.user.email }, (err, data) => {
      if (err) {
        console.log(err);
        req.flash(
          "indexMessage",
          "Hubo problemas buscando la publicación, intenta más tarde"
        );
        res.redirect("/adopta-pets");
      } else if (!data) {
        req.flash(
          "indexMessage",
          "La publicación solicitada no se encuentra registrada"
        );
        res.redirect("/adopta-pets");
      } else {
        res.render("publications/edit", {
          publication: data,
          message: req.flash("pubMessage")
        });
      }
    });
  } else {
    res.redirect("/adopta-pets");
  }
};

// PUT /publications/:id/edit -- Edit publication
exports.update = (req, res) => {
  if (
    req.user.state.includes("1") ||
    req.user.state.includes("2") ||
    req.user.state.includes("4")
  ) {
    upload(req, res, err => {
      if (err) {
        console.log(err);
        req.flash(
          "indexMessage",
          "Hubo problemas guardando la publicación, intenta de nuevo"
        );
        res.redirect("/adopta-pets");
      } else {
        const { id } = req.params;

        const pet = {
          color: req.body["pet.color"],
          otherColor: req.body["pet.color"] === "otro"
            ? `${req.body["otherColor"]
                .trim()[0]
                .toUpperCase()}${req.body["otherColor"]
                .slice(1)
                .toLowerCase()
                .trim()}`
            : "",
          size: req.body["pet.size"],
          name: req.body["pet.name"].toUpperCase().trim(),
          age: Number(req.body["pet.age"]),
          time: req.body["pet.time"],
          gender: req.body["pet.gender"],
          type: req.body["pet.type"]
        };

        const publication = {
          phone: req.body["phone"],
          description: req.body["description"] ? req.body["description"] : "",
          email: req.body["email"],
          createdBy: req.user.email,
          address: req.body["address"],
          lat: req.body["lat"],
          lng: req.body["lng"],
          features: pet,
          available: req.body.available ? false : true
        };

        Publication.findOneAndUpdate(
          { _id: id, createdBy: req.user.email },
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
              res.redirect("/adopta-pets");
            } else {
              if (req.files) {
                renameFiles(
                  data._id,
                  req.files,
                  data.photos.length,
                  (err, photos) => {
                    if (err) {
                      console.log(err);
                      req.flash(
                        "indexMessage",
                        "Hubo problemas actualizando los datos " +
                          "de la publicación, intenta más tarde"
                      );
                      res.redirect("/adopta-pets");
                    } else {
                      Publication.findOneAndUpdate(
                        { _id: id, createdBy: req.user.email },
                        { photos: data.photos.concat(photos) },
                        { new: true },
                        (err, pub) => {
                          if (err) {
                            console.log(err);
                            req.flash(
                              "indexMessage",
                              "Hubo problemas actualizando los datos " +
                                "de la publicación, intenta más tarde"
                            );
                            return res.redirect("/adopta-pets");
                          }
                          req.flash(
                            "pubMessage",
                            "Los datos han sido actualizados exitosamente"
                          );
                          res.redirect(`/adopta-pets/publications/${id}/edit`);
                        }
                      );
                    }
                  }
                );
              } else {
                req.flash(
                  "pubMessage",
                  "Los datos han sido actualizados exitosamente"
                );
                res.redirect(`/adopta-pets/publications/${id}/edit`);
              }
            }
          }
        );
      }
    });
  } else {
    res.redirect("/adopta-pets");
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
      res.redirect("/adopta-pets");
    } else if (!data) {
      req.flash(
        "indexMessage",
        "La publicación solicitada no se encuentra registrada"
      );
      res.redirect("/adopta-pets");
    } else {
      res.render("publications/show", { publication: data });
    }
  });
};

// GET /publications/:id/facebook -- Get a specific publication for share with facebook
exports.facebook = (req, res) => {
  const { id } = req.params;
  Publication.findById(id, (err, data) => {
    if (err) {
      console.log(err);
      req.flash(
        "indexMessage",
        "Hubo problemas buscando la publicación, intenta más tarde"
      );
      res.redirect("/adopta-pets");
    } else if (!data) {
      req.flash(
        "indexMessage",
        "La publicación solicitada no se encuentra registrada"
      );
      res.redirect("/adopta-pets");
    } else {
      res.render("publications/facebook", { publication: data });
    }
  });
};

// GET /publications -- All publications
exports.getPublications = (req, res) => {
  Publication.find({ available: true }, (err, data) => {
    if (err) {
      console.log(err);
      req.flash(
        "indexMessage",
        "Hubo problemas obteniendo los datos de las publicaciones, " +
          "intenta de nuevo"
      );
      res.redirect("/adopta-pets");
    } else if (data.length > 0) {
      const { page } = req.query;
      if (!req.query.page || page <= 0) {
        return res.redirect("/adopta-pets/publications?page=1");
      }

      const pages = paginator(data, page);
      if (pages.data.length == 0) {
        return res.redirect("/adopta-pets/publications?page=1");
      }

      res.render("publications/all", {
        publications: pages.data,
        size: pages.size,
        group: pages.group,
        left: pages.left,
        right: pages.right
      });
    } else {
      req.flash("indexMessage", "No hay publicaciones disponibles");
      res.redirect("/adopta-pets");
    }
  });
};

// GET /publications -- All me publications
exports.getMyPublications = (req, res) => {
  Publication.find({ createdBy: req.user.email }, (err, data) => {
    if (err) {
      console.log(err);
      req.flash(
        "indexMessage",
        "Hubo problemas obteniendo los datos de las publicaciones, " +
          "intenta de nuevo"
      );
      res.redirect("/adopta-pets");
    } else if (data.length > 0) {
      const { page } = req.query;
      if (!req.query.page || page <= 0) {
        return res.redirect("/adopta-pets/publications?page=1");
      }

      const pages = paginator(data, page);
      if (pages.data.length == 0) {
        return res.redirect("/adopta-pets/publications?page=1");
      }

      res.render("publications/me", {
        publications: pages.data,
        size: pages.size,
        group: pages.group,
        left: pages.left,
        right: pages.right
      });
    } else {
      req.flash("indexMessage", "No hay publicaciones disponibles");
      res.redirect("/adopta-pets");
    }
  });
};

// GET /publications/search -- Search publications
exports.search = (req, res) => {
  if (req.query.lat1 && req.query.lng1) {
    const lat1 = parseFloat(req.query.lat1);
    const lon1 = parseFloat(req.query.lng1);
    const dist = req.query.dist && req.query.dist >= 0
      ? Number(req.query.dist)
      : 3;
    let filter = {};
    const amount = req.query.amount > 0 ? req.query.amount : 1;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.size) filter.size = req.query.size;
    if (req.query.age) filter.age = Number(req.query.age);
    if (req.query.time) filter.time = req.query.time;
    if (req.query.gender) filter.gender = req.query.gender;
    if (req.query.color) {
      filter.color = req.query.color;
      if (req.query.color === "otro") {
        if (req.query.otherColor) {
          let { otherColor } = req.query;
          otherColor = otherColor.trim()[0].toUpperCase() +
            otherColor.slice(1).toLowerCase().trim();
          filter.otherColor = otherColor;
        }
      }
    }

    Publication.find({ available: true }, (err, data) => {
      if (err) {
        console.log(err);
        req.flash(
          "indexMessage",
          "Hubo problemas obteniendo los datos de las publicaciones, " +
            "intenta de nuevo"
        );
        res.redirect("/adopta-pets");
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
        if (pubs.length > 0) {
          const total = pubs.length > 0 ? pubs.length : 1;
          res.render("publications/search", {
            publications: pubs.slice(0, amount),
            lat: lat1,
            lng: lon1,
            total,
            message: "Se han encontrado resultados exitosamente"
          });
        } else {
          res.render("publications/search", {
            total: 1,
            message: "No se encontraron resultados"
          });
        }
      } else {
        res.render("publications/search", {
          message: "No hay publicaciones disponibles"
        });
      }
    });
  } else {
    Publication.find({ available: true }, (err, data) => {
      if (err) {
        console.log(err);
        req.flash(
          "indexMessage",
          "Hubo problemas obteniendo los datos de las publicaciones, " +
            "intenta de nuevo"
        );
        res.redirect("/adopta-pets");
      } else {
        const total = data.length > 0 ? data.length : 1;
        res.render("publications/search", { message: "", total });
      }
    });
  }
};

// DELETE /publications/:id -- Delete a specific publication
exports.delete = (req, res) => {
  if (
    req.user.state.includes("1") ||
    req.user.state.includes("2") ||
    req.user.state.includes("4")
  ) {
    const { id } = req.params;
    Publication.findOneAndRemove(
      { _id: id, createdBy: req.user.email },
      (err, data) => {
        if (err) {
          console.log(err);
          req.flash(
            "indexMessage",
            "Hubo problemas para eliminar la publicación, intenta más tarde"
          );
          res.redirect("/adopta-pets");
        } else {
          deleteFiles(data.photos, err => {
            if (err) {
              req.flash(
                "indexMessage",
                "Hubo problemas para eliminar la publicación, intenta más tarde"
              );
              return res.redirect("/adopta-pets");
            }
            req.flash(
              "indexMessage",
              "La publicación ha sido eliminada exitosamente"
            );
            res.redirect("/adopta-pets");
          });
        }
      }
    );
  } else {
    res.redirect("/adopta-pets");
  }
};

exports.deleteImg = (req, res) => {
  if (
    req.user.state.includes("1") ||
    req.user.state.includes("2") ||
    req.user.state.includes("4")
  ) {
    const { id } = req.params;
    Publication.findOne({ _id: id, createdBy: req.user.email }, (err, data) => {
      if (err) {
        console.log(err);
        req.flash(
          "indexMessage",
          "Hubo problemas para eliminar la publicación, intenta más tarde"
        );
        res.redirect("/adopta-pets");
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
                return res.redirect("/adopta-pets");
              }
              deleteFiles([req.body.photo], err => {
                if (err) {
                  console.log(err);
                  req.flash(
                    "indexMessage",
                    "Hubo problemas actualizando los datos " +
                      "de la publicación, intenta más tarde"
                  );
                  return res.redirect("/adopta-pets");
                }
                req.flash(
                  "pubMessage",
                  "Los datos han sido actualizados exitosamente"
                );
                res.redirect(`/adopta-pets/publications/${id}/edit`);
              });
            }
          );
        }
      }
    });
  } else {
    res.redirect("/adopta-pets");
  }
};
