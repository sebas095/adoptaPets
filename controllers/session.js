// GET /login -- Login form
exports.new = (req, res) => {
  res.render('session/new');
};

// GET /account/newPassword -- Request for new password
exports.newPassword = (req, res) => {
  res.render('session/newPassword');
};

// GET /account/resetPassword/:token -- New password form
exports.resetPassword = (req, res) => {
  res.render('session/resetPassword');
};
