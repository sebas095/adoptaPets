const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const {Schema} = mongoose;

const PetSchema = new Schema({
  color: {
    type: String,
    require: true,
  },
  size: {
    type: String,
    require: true,
  },
  breed: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    require: true,
  },
  gender: {
    type: String,
    require: true,
  },
});

const PublicationSchema = new Schema({
  phone: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  lat: {
    type: Number,
    require: true,
  },
  lng: {
    type: Number,
    require: true,
  },
  photos: {
    type: Array,
    require: true,
  },
  features: {
    type: PetSchema,
    require: true,
  },
});

PublicationSchema.plugin(timestamp);
module.exports = mongoose.model('Publication', PublicationSchema);
