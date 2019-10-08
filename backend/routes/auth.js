// Dependencies
const jwt = require("express-jwt");
const { secret } = require("../config");

// Helpers
const getTokenFromHeader = req => {
  const authData = req.headers.authorization;
  const isTokenBearer =
    (authData && authData.split(" ")[0] === "Token") ||
    (authData && authData.split(" ")[0] === "Bearer");
  return isTokenBearer ? authData.split(" ")[1] : null;
};

// Main process
const auth = {
  required: jwt({
    secret,
    userProperty: "payload",
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret,
    userProperty: "payload",
    credentialsRequired: false,
    getToken: getTokenFromHeader
  })
};

module.exports = auth;
