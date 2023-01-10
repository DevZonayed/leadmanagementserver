const Token = require("../../helper/TokenHelper");
const AsyncHandler = require("express-async-handler");

const UserAuth = AsyncHandler(async (req, res, next) => {
  const userToken = req.headers.authorization?.split(" ").pop() || null;
  //   Null token validation
  if (!userToken) {
    let error = new Error("Token not found !");
    res.status(498);
    next(error);
    return;
  }

  let tokenInfo = await Token.match(userToken);
  //   Invalid Token Velidation
  if (!tokenInfo) {
    let error = new Error("Invalid Token !");
    res.status(498);
    next(error);
    return;
  }

  //   Login Timeout Validation
  if (tokenInfo.exp < new Date().getTime()) {
    let error = new Error("Login expired !");
    res.status(440);
    next(error);
    return;
  }
  req.tokenInfo = {
    ...tokenInfo,
  };
  next();
});

module.exports = UserAuth;
