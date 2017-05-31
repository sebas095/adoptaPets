const User = require("../models/user");
const { auth } = require("../config/email");
const nodemailer = require("nodemailer");
const { paginator } = require("../helpers/utils");
const transporter = nodemailer.createTransport(
  `smtps://${auth.user}:${auth.pass}@smtp.gmail.com`
);

// GET /users/register -- Register form
exports.newUser = (req, res) => {
  if (!req.isAuthenticated()) {
    res.render("users/new");
  } else {
    res.redirect("/adopta-pets/profile");
  }
};

// POST /users/register -- Create a new user
exports.createUser = (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      console.log("Error: ", err.code);
      req.flash(
        "indexMessage",
        "Hubo problemas en el registro, intenta de nuevo"
      );
      return res.redirect("/adopta-pets");
    } else if (users.length == 0) {
      req.body.state = "1";
    } else {
      req.body.state = "2";
    }

    User.create(req.body, (err, user) => {
      if (err) {
        console.log(err);
        if (err.code === 11000) {
          req.flash(
            "indexMessage",
            "Ya existe un usuario registrado con ese correo, intenta con otro"
          );
        } else {
          req.flash(
            "indexMessage",
            "Hubo problemas en el registro, intenta de nuevo"
          );
        }
        return res.redirect("/adopta-pets");
      }
      req.flash("loginMessage", "Tu cuenta ha sido creada exitosamente");
      return res.redirect("/adopta-pets/session/login");
    });
  });
};

// PUT /users/:id -- Modifies user data
exports.updateUser = (req, res) => {
  if (req.user.state.includes("1")) {
    const { id, rol } = req.params;
    if (rol === "admin-user") {
      if (req.body[`status-${id}`]) {
        req.body.state = "1";
      } else {
        req.body.state = "2";
      }
    }

    User.findOneAndUpdate(
      { _id: id, email: req.body.email },
      req.body,
      { new: true },
      (err, user) => {
        if (err) {
          console.log("Error: ", err);
          req.flash(
            "indexMessage",
            "Hubo problemas actualizando los datos, intenta de nuevo"
          );
          return res.redirect("/adopta-pets");
        } else {
          req.flash(
            "adminMessage",
            "Los datos han sido actualizados exitosamente"
          );
          res.redirect("/adopta-pets/users/admin");
        }
      }
    );
  } else {
    res.redirect("/adopta-pets");
  }
};

// PUT /profile -- Modifies user profile data
exports.updateProfile = (req, res) => {
  if (
    req.user.state.includes("1") ||
    req.user.state.includes("2") ||
    req.user.state.includes("4")
  ) {
    User.findOneAndUpdate(
      { _id: req.user._id, email: req.user.email },
      req.body,
      { new: true },
      (err, user) => {
        if (err) {
          console.log("Error: ", err);
          req.flash(
            "indexMessage",
            "Hubo problemas actualizando los datos, intenta de nuevo"
          );
          return res.redirect("/adopta-pets");
        } else {
          req.flash(
            "userMessage",
            "Sus datos han sido actualizados exitosamente"
          );
          res.redirect("/adopta-pets/profile");
        }
      }
    );
  } else {
    res.redirect("/adopta-pets");
  }
};

// DELETE /users/:id -- Deactivate user account
exports.deleteUser = (req, res) => {
  if (req.user.state.includes("1")) {
    const { id } = req.params;
    User.findByIdAndUpdate(
      id,
      {
        state: req.body.status
      },
      { new: true },
      (err, user) => {
        if (err) {
          console.log(err);
          req.flash(
            "indexMessage",
            "Hubo problemas desactivando la cuenta, intenta de nuevo"
          );
          return res.redirect("/adopta-pets");
        }
        req.flash("adminMessage", "El estado de la cuenta ha sido actualizada");
        res.redirect("/adopta-pets/users/admin");
      }
    );
  } else {
    res.redirect("/adopta-pets");
  }
};

// GET /users/admin -- Return all the users
exports.getUsers = (req, res) => {
  if (req.user.state.includes("1")) {
    User.find(
      {
        $or: [{ state: "1" }, { state: "2" }, { state: "3" }],
        _id: { $ne: req.user._id }
      },
      (err, users) => {
        if (err) {
          console.log("Error: ", err);
          req.flash(
            "indexMessage",
            "Hubo problemas obteniendo los datos de los usuarios, " +
              "intenta de nuevo"
          );
          res.redirect("/adopta-pets");
        } else if (users.length > 0) {
          const { page } = req.query;
          if (!req.query.page || page <= 0) {
            return res.redirect("/adopta-pets/users/admin?page=1");
          }

          const pages = paginator(users, page);
          if (pages.data.length == 0) {
            return res.redirect("/adopta-pets/users/admin?page=1");
          }

          res.render("users/admin", {
            users: pages.data,
            size: pages.size,
            group: pages.group,
            left: pages.left,
            right: pages.right,
            user: req.user,
            message: req.flash("adminMessage")
          });
        } else {
          req.flash("indexMessage", "No hay usuarios disponibles");
          res.redirect("/adopta-pets");
        }
      }
    );
  } else {
    req.flash("indexMessage", "No tienes permisos para acceder");
    res.redirect("/adopta-pets");
  }
};

// GET /users/pending/deactivate -- Users with pending account for deactivate
exports.deactivatePendingAccount = (req, res) => {
  if (req.user.state.includes("1")) {
    User.find({ state: "4" }, (err, users) => {
      if (err) {
        console.log("Error: ", err);
        req.flash(
          "indexMessage",
          "Hubo problemas obteniendo los datos de los usuarios, " +
            "intenta de nuevo"
        );
        res.redirect("/adopta-pets");
      } else if (users.length > 0) {
        const { page } = req.query;
        if (!req.query.page || page <= 0) {
          return res.redirect("/adopta-pets/users/pending/deactivate?page=1");
        }

        const pages = paginator(users, page);
        if (pages.data.length == 0) {
          return res.redirect("/adopta-pets/users/pending/deactivate?page=1");
        }

        res.render("users/deactivate", {
          users: pages.data,
          size: pages.size,
          group: pages.group,
          left: pages.left,
          right: pages.right,
          user: req.user,
          message: req.flash("pendingDeactivateUsers")
        });
      } else {
        req.flash(
          "indexMessage",
          "No hay usuarios disponibles para la desactivación de cuentas"
        );
        res.redirect("/adopta-pets");
      }
    });
  } else {
    req.flash("indexMessage", "No tienes permisos para acceder");
    res.redirect("/adopta-pets");
  }
};

// PUT /users/:id/deactiveAccount -- Request for deactivate account
exports.changeState = (req, res) => {
  if (req.user.state.includes("2")) {
    const { id } = req.params;
    User.findOneAndUpdate(
      { _id: id, email: req.user.email },
      { state: "4" },
      { new: true },
      (err, user) => {
        if (err) {
          console.log(err);
          req.flash(
            "indexMessage",
            "Hubo problemas en la solicitud de desactivación de la cuenta"
          );
          return res.redirect("/adopta-pets");
        }
        User.find({ state: "1" }, (err, users) => {
          if (err) {
            console.log(err);
            req.flash(
              "indexMessage",
              "Hubo problemas para notificar al administrador"
            );
            return res.redirect("/adopta-pets");
          } else if (users.length > 0) {
            let emails = "";
            for (let i = 0; i < users.length; i++) {
              if (i > 0) emails += ",";
              emails += users[i].email;
            }

            const mailOptions = {
              from: "Administración Adopta Pets",
              to: emails,
              subject: "Desactivación de cuentas de Adopta Pets",
              html: `<p>Estimado Usuario administrador,</p><br>Se le informa que
                hay solicitudes para la desactivación de cuentas, para su
                aprobación, si deseas ingresar ve a la siguiente dirección:<br>
                <a href="${HOST}/users/pending/deactivate">Iniciar sesión</a>
                <br><br><br>Att,<br><br>Equipo Administrativo Adopta Pets`
            };

            transporter.sendMail(mailOptions, err => {
              if (err) console.log(err);
              req.flash(
                "userMessage",
                "Pronto el administrador revisara tu solicitud " +
                  `y se te notificara al correo electrónico de ${user.email}`
              );
              res.redirect("/adopta-pets/profile");
            });
          } else {
            req.flash("indexMessage", "No hay administradores disponibles");
            res.redirect("/adopta-pets");
          }
        });
      }
    );
  } else {
    res.redirect("/adopta-pets");
  }
};

// PUT /users/deactivateAccount -- Users deactivate account
exports.deactivateAccount = (req, res) => {
  if (req.user.state.includes("1")) {
    const { email } = req.body;
    if (req.body.account === "accept") {
      User.findOneAndUpdate(
        {
          email: email
        },
        { state: "3" },
        { new: true },
        (err, user) => {
          if (err) {
            console.log("Error: ", err);
            req.flash(
              "indexMessage",
              "Hubo problemas desactivando la cuenta del usuario"
            );
            res.redirect("/adopta-pets");
          } else if (user) {
            const mailOptions = {
              from: "Administración Adopta Pets",
              to: user.email,
              subject: "Desactivación de cuenta en Adopta Pets",
              html: `<p>Estimado Usuario ${user.firstname} ${user.lastname},</p>
              <br>Se le informa que su cuenta en Adopta Pets ha sido desactivada
               exitosamente.<br><br><br>Att,<br><br>
              Equipo Administrativo Adopta Pets`
            };

            transporter.sendMail(mailOptions, err => {
              if (err) console.log(err);
              res.redirect("/adopta-pets/users/pending/deactivate");
            });
          } else {
            req.flash(
              "pendingDeactivateUsers",
              `No existe el usuario con el correo ${email}`
            );
            res.redirect("/adopta-pets/users/pending/deactivate");
          }
        }
      );
    } else {
      User.findOneAndUpdate(
        {
          email: email
        },
        { state: "2" },
        { new: true },
        (err, user) => {
          if (err) {
            console.log("Error: ", err);
            req.flash(
              "indexMessage",
              "Hubo problemas con la cuenta del usuario"
            );
            res.redirect("/adopta-pets");
          } else if (user) {
            const mailOptions = {
              from: "Administración Adopta Pets",
              to: user.email,
              subject: "Desactivación de cuenta en Adopta Pets",
              html: `<p>Estimado Usuario ${user.firstname} ${user.lastname},</p>
                <br>Se le informa que su cuenta en Adopta Pets no ha sido
                desactivada.<br><br><br>Att,<br><br>
                Equipo Administrativo Adopta Pets`
            };

            transporter.sendMail(mailOptions, err => {
              if (err) console.log(err);
              res.redirect("/adopta-pets/users/pending/deactivate");
            });
          } else {
            req.flash(
              "pendingDeactivateUsers",
              `No existe el usuario con el correo ${email}`
            );
            res.redirect("/adopta-pets/users/pending/deactivate");
          }
        }
      );
    }
  } else {
    req.flash("indexMessage", "No tienes permisos para acceder");
    res.redirect("/adopta-pets");
  }
};

exports.contact = (req, res) => {
  User.find({ state: "1" }, (err, users) => {
    if (err) {
      console.log(err);
      req.flash(
        "indexMessage",
        "Hubo problemas en el registro, intenta de nuevo"
      );
      return res.redirect("/adopta-pets");
    } else if (users.length > 0) {
      let emails = "";
      for (let i = 0; i < users.length; i++) {
        if (i > 0) emails += ",";
        emails += users[i].email;
      }

      const mailOptions = {
        from: "Administración",
        to: emails,
        subject: "Opiniones y Sugerencias para Adopta Pets ",
        html: `<p>Estimado Usuario administrador,</p><br>Se le informa que
          <b>${req.body.fullname}</b> con el correo <b>${req.body.email}</b>
           tiene la(s) siguiente(s) opiniones y/o sugerencias:
          <br><br>${req.body.msg}`
      };

      transporter.sendMail(mailOptions, err => {
        if (err) console.log(err);
        req.flash("indexMessage", "Su mensaje ha sido enviado exitosamente");
        res.redirect("/adopta-pets");
      });
    } else {
      req.flash("indexMessage", "Hubo problemas en el servidor");
      res.redirect("/adopta-pets");
    }
  });
};
