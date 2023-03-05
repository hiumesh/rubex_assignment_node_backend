const jwt = require("jsonwebtoken");
const { JWT_DECODE_ERR } = require("../error");
const { JWT_SECRET } = require("../config");

exports.createJwtToken = (payload) => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });
  return token;
};

exports.verifyJwtToken = (token, next) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch (err) {
    next(err);
  }
};
