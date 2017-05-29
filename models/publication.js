const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");
const { Schema } = mongoose;

const PetSchema = new Schema({
  color: {
    type: String,
    require: true,
    validate(color) {
      return color.length > 0;
    }
  },
  otherColor: {
    type: String,
    require: true,
    default: ""
  },
  size: {
    type: String,
    require: true,
    validate(size) {
      return size.length > 0;
    }
  },
  name: {
    type: String,
    require: true,
    validate(name) {
      return /(?=^.{2,}$)[A-Za-zñÑáÁéÉíÍóÓúÚüÜ ]+/.test(name);
    }
  },
  time: {
    type: String,
    require: true,
    validate(time) {
      return time.length > 0;
    }
  },
  age: {
    type: Number,
    require: true,
    validate(age) {
      return age > 0;
    }
  },
  gender: {
    type: String,
    require: true,
    validate(gender) {
      return gender.length > 0;
    }
  },
  type: {
    type: String,
    require: true,
    validate(type) {
      return type.length > 0;
    }
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
    require: true,
    validate(phone) {
      return /[0-9]+/.test(phone);
    }
  },
  description: {
    type: String,
    default: ""
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
    require: true,
    default: ""
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
    require: true,
    default: []
  },
  features: {
    type: PetSchema,
    require: true
  },
  available: {
    type: Boolean,
    require: true,
    default: true
  }
});

PublicationSchema.plugin(timestamp);
module.exports = mongoose.model("Publication", PublicationSchema);
