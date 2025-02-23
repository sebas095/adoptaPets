const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
  firstname: {
    type: String,
    require: true,
    validate(firstname) {
      return /(?=^.{2,}$)[A-Za-zñÑáÁéÉíÍóÓúÚüÜ ]+/.test(firstname);
    }
  },
  lastname: {
    type: String,
    require: true,
    validate(lastname) {
      return /(?=^.{2,}$)[A-Za-zñÑáÁéÉíÍóÓúÚüÜ ]+/.test(lastname);
    }
  },
  email: {
    type: String,
    require: true,
    unique: true,
    validate(email) {
      return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      );
    }
  },
  phone: {
    type: String,
    require: true,
    validate(phone) {
      return /[0-9]+/.test(phone);
    }
  },
  state: {
    type: String,
    enum: ["1", "2", "3", "4", "5"],
    default: "2"
    // 1: admin, 2: user ok, 3: user disabled, 4: removal request
    // 5: admin possible
  },
  password: {
    type: String,
    require: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

// Encrypt the password
UserSchema.pre("save", function(next) {
  let user = this;
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

UserSchema.plugin(timestamp);
module.exports = mongoose.model("User", UserSchema);
