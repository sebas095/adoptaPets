const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");
const { Schema } = mongoose;

const PetSchema = new Schema({
  color: {
    type: String,
    require: true
  },
  size: {
    type: String,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  age: {
    type: Number,
    require: true
  },
  gender: {
    type: String,
    require: true
  }
});

const PublicationSchema = new Schema({
  uid: {
    type: String,
    require: true,
    unique: true,
    index: true
  },
  phone: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    validate(email) {
      return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      );
    },
    index: false,
    unique: false
  },
  address: {
    type: String,
    require: true
  },
  lat: {
    type: Number,
    require: true
  },
  createdBy: {
    type: String,
    require: true
  },
  lng: {
    type: Number,
    require: true
  },
  photos: {
    type: Array,
    require: true
  },
  features: {
    type: PetSchema,
    require: true
  }
});

PublicationSchema.plugin(timestamp);
module.exports = mongoose.model("Publication", PublicationSchema);
