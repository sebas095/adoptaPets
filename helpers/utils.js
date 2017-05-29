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

exports.renameFiles = (id, files, offset, callback) => {
  const wrapped = files.map((value, index) => {
    return { index: index + offset, value: value };
  });
  async.map(
    wrapped,
    (file, cb) => {
      const dir = __dirname + "/../" + file.value.destination;
      const { filename } = file.value;
      const ext = path.extname(file.value.originalname);
      const newName = id + file.index + Date.now() + ext;
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

exports.getDistance = (lat1, lon1, lat2, lon2) => {
  const degToRad = deg => deg * (Math.PI / 180);
  const R = 6371; // Radius of the earth in km
  const dLat = degToRad(lat2 - lat1);
  const dLon = degToRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) *
      Math.cos(degToRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};
