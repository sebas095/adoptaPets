const fs = require("fs");
const async = require("async");
const path = require("path");

exports.imageFilter = (req, file, cb) => {
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

exports.renameFiles = (id, files, callback) => {
  const wrapped = files.map((value, index) => {
    return { index: index, value: value };
  });
  async.map(
    wrapped,
    (file, cb) => {
      const dir = __dirname + "/../" + file.value.destination;
      const { filename } = file.value;
      const ext = path.extname(file.value.originalname);
      const newName = id + file.index + ext;
      fs.rename(`${dir}/${filename}`, `${dir}/${newName}`, err => {
        if (err) return cb(err, null);
        cb(null, newName);
      });
    },
    (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    }
  );
};

exports.deleteFiles = (files, callback) => {
  async.map(
    files,
    (file, cb) => {
      const dir = __dirname + "/../public/uploads";
      fs.unlink(`${dir}/${file}`, err => {
        if (err) return cb(err);
        cb(null);
      });
    },
    err => {
      if (err) return callback(err);
      callback(null);
    }
  );
};
