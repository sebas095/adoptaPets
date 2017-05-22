const Publication = require("../models/publication");
const multer = require("multer");
const { imageFilter, renameFiles } = require("../helpers/utils");
const upload = multer({
  dest: "public/uploads",
  fileFilter: imageFilter
}).array("pet.photos", 5);

// GET /publications/new -- Publication form
exports.new = (req, res) => {
  res.render("publications/new");
};

// POST /publications/new -- Create a new publication
exports.create = (req, res) => {
  upload(req, res, err => {
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
  });
};

// GET /publications/:id/edit -- Edit publication form
exports.edit = (req, res) => {
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
};

// PUT /publications/:id/edit -- Edit publication
exports.update = (req, res) => {
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
    // photos: [],
    features: pet
  };

  Publication.findByIdAndUpdate(id, publication, { new: true }, (err, data) => {
    if (err) {
      console.log(err);
      req.flash(
        "indexMessage",
        "Hubo problemas actualizando los datos " +
          "de la publicación, intenta más tarde"
      );
      res.redirect("/");
    } else {
      req.flash("pubMessage", "Los datos han sido actualizados exitosamente");
      res.redirect(`/publications/${id}/edit`);
    }
  });
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
  res.render("publications/search");
};

// DELETE /publications/:id -- Delete a specific publication
exports.delete = (req, res) => {
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
      req.flash(
        "indexMessage",
        "La publicación ha sido eliminada exitosamente"
      );
      res.redirect("/");
    }
  });
};
