const { MONGODB_URI } = require('./config');

const mongoose = require('mongoose');

module.exports.connectDB = function () {
  return mongoose.connect(MONGODB_URI, {
    maxPoolSize: 10,
    authSource: "admin",
    user: "umesh",
    pass: "uswag007",
    
  });
}