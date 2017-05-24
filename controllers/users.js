const User = require("../models/user");
const { auth } = require("../config/email");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport(
  `smtps://${auth.user}:${auth.pass}@smtp.gmail.com`
);

// GET /users/register -- Register form
exports.newUser = (req, res) => {
  if (!req.isAuthenticated()) {
    res.render("users/new");
  } else {
    res.redirect("/profile");
  }
};

// POST /users/register -- Create a new user
exports.createUser = (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      console.log("Error: ", err);
      req.flash(
        "indexMessage",
        "Hubo problemas en el registro, intenta de nuevo"
      );
      return res.redirect("/");
    } else if (users.length == 0) {
      req.body.state = "1";
    } else {
      req.body.state = "2";
    }

    User.create(req.body, (err, user) => {
      if (err) {
        console.log(err);
        req.flash(
          "indexMessage",
          "Hubo problemas en el registro, intenta de nuevo"
        );
        return res.redirect("/");
      }
      req.flash("loginMessage", "Tu cuenta ha sido creada exitosamente");
      return res.redirect("/session/login");
    });
  });
};

// PUT /users/:id -- Modifies user data
exports.updateUser = (req, res) => {
  if (
    req.user.state.includes("1") ||
    req.user.state.includes("2") ||
    req.user.state.includes("4")
  ) {
    const id = req.params.id || req.user._id;

    if (req.body.rol === "admin/user") {
      if (req.body.status) {
        req.body.state = "1";
      } else {
        req.body.state = "2";
      }
    }

    User.findByIdAndUpdate(id, req.body, { new: true }, (err, user) => {
      if (err) {
        console.log("Error: ", err);
        req.flash(
          "indexMessage",
          "Hubo problemas actualizando los datos, intenta de nuevo"
        );
        return res.redirect("/");
      } else if (req.originalUrl.includes("/users/")) {
        req.flash(
          "adminMessage",
          "Los datos han sido actualizados exitosamente"
        );
        res.redirect("/users/admin");
      } else {
        req.flash(
          "userMessage",
          "Sus datos han sido actualizados exitosamente"
        );
        res.redirect("/profile");
      }
    });
  } else {
    res.redirect("/");
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
          return res.redirect("/");
        }
        req.flash("adminMessage", "El estado de la cuenta ha sido actualizada");
        res.redirect("/users/admin");
      }
    );
  } else {
    res.redirect("/");
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
          res.redirect("/");
        } else if (users.length > 0) {
          res.render("users/admin", {
            users: users,
            user: req.user,
            message: req.flash("adminMessage")
          });
        } else {
          req.flash("indexMessage", "No hay usuarios disponibles");
          res.redirect("/");
        }
      }
    );
  } else {
    req.flash("indexMessage", "No tienes permisos para acceder");
    res.redirect("/");
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
        res.redirect("/");
      } else if (users.length > 0) {
        res.render("users/deactivate", {
          users: users,
          user: req.user,
          message: req.flash("pendingDeactivateUsers")
        });
      } else {
        req.flash(
          "indexMessage",
          "No hay usuarios disponibles para la desactivación de cuentas"
        );
        res.redirect("/");
      }
    });
  } else {
    req.flash("indexMessage", "No tienes permisos para acceder");
    res.redirect("/");
  }
};

// PUT /users/:id/deactiveAccount -- Request for deactivate account
exports.changeState = (req, res) => {
  if (req.user.state.includes("2") || req.user.state.includes("4")) {
    const { id } = req.params;
    User.findByIdAndUpdate(id, { state: "4" }, { new: true }, (err, user) => {
      if (err) {
        console.log(err);
        req.flash(
          "indexMessage",
          "Hubo problemas en la solicitud de desactivación de la cuenta"
        );
        return res.redirect("/");
      }
      User.find({ state: "1" }, (err, users) => {
        if (err) {
          console.log(err);
          req.flash(
            "indexMessage",
            "Hubo problemas para notificar al administrador"
          );
          return res.redirect("/");
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
            res.redirect("/profile");
          });
        } else {
          req.flash("indexMessage", "No hay administradores disponibles");
          res.redirect("/");
        }
      });
    });
  } else {
    res.redirect("/");
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
            res.redirect("/");
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
              res.redirect("/users/pending/deactivate");
            });
          } else {
            req.flash(
              "pendingDeactivateUsers",
              `No existe el usuario con el correo ${email}`
            );
            res.redirect("/users/pending/deactivate");
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
            res.redirect("/");
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
              res.redirect("/users/pending/deactivate");
            });
          } else {
            req.flash(
              "pendingDeactivateUsers",
              `No existe el usuario con el correo ${email}`
            );
            res.redirect("/users/pending/deactivate");
          }
        }
      );
    }
  } else {
    req.flash("indexMessage", "No tienes permisos para acceder");
    res.redirect("/");
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
      return res.redirect("/");
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
        res.redirect("/");
      });
    } else {
      req.flash("indexMessage", "Hubo problemas en el servidor");
      res.redirect("/");
    }
  });
};
