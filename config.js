const messageBird = require('messagebird');
require("dotenv").config();

exports.messageBird = messageBird.initClient(process.env.MESSAGEBIRD_API_KEY);


exports.PORT = process.env.PORT;
exports.MONGODB_URI = process.env.MONGODB_URI;
exports.NODE_ENV = process.env.NODE_ENV;

exports.JWT_SECRET = process.env.JWT_SECRET;
exports.ORIGIN = process.env.ORIGIN;