const mongoose = require('mongoose');

const { INVALID_MOBILE_NUMBER } = require('../error');

const mobileRegex = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,2})$/;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  dob: {
    type: Date,
  },
  avatar: {
    type: String,
    required: true,
    default: "https://play-lh.googleusercontent.com/_AZh1k1NH6Not02D0WRrkzHV2VqTiaWLzlguM-6SD1YjFDzP2wII-8MvkiUD4Pm3fuI",
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return mobileRegex.test(v);
      },
      message: INVALID_MOBILE_NUMBER,
    }
  },
  otp: String,
  profileSetupCompleted: {
    type: Boolean,
    required: true,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);