// GET /publications/new -- Publication form
exports.new = (req, res) => {
  res.render('publications/new');
};

exports.edit = (req, res) => {
  res.render('publications/edit');
};
