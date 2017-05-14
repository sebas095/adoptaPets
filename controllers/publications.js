const Publication = require('../models/publication');

// GET /publications/new -- Publication form
exports.new = (req, res) => {
  res.render('publications/new');
};

// POST /publications/new -- Create a new publication
exports.create = (req, res)=> {

};

// GET /publications/:id/edit -- Edit publication form
exports.edit = (req, res) => {
  // const {id} = req.params;
  // Publication.findById(id, (err, data) => {
  //   if (err) {
  //
  //   } else if (!data) {
  //
  //   } else {
  //     res.render('publications/edit', {publication: data});
  //   }
  // });
  res.render('publications/edit');
};

// PUT /publications/:id/edit -- Edit publication
exports.update = (req, res) => {

};

// GET /publications/:id -- Get a specific publication
exports.show = (req, res) => {
  res.render('publications/show');
};

// GET /publications -- All publications
exports.getPublications = (req, res) => {
  // Publication.find({}, (err, data) => {
  //   if (err) {
  //
  //   } else if (data.length === 0) {
  //
  //   } else {
  //
  //   }
  // });
  res.render('publications/all');
};

// GET /publications/search -- Search publications
exports.search = (req, res) => {
  res.render('publications/search');
};
