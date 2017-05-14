// GET /publications/new -- Publication form
exports.new = (req, res) => {
  res.render('publications/new');
};

// GET /publications/edit -- Edit publication
exports.edit = (req, res) => {
  res.render('publications/edit');
};

// GET /publications/search -- Search publications
exports.search = (req, res) => {
  res.render('publications/search');
};
