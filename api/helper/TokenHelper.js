const jwt = require("jsonwebtoken");

class Token {
  /**
   * This method will generate a json web token
   * @param {Object} data
   */
  static generate(data) {
    return jwt.sign(
      {
        ...data,
        exp: new Date(
          Date.now() + process.env.TOKEN_EXPAIR * 24 * 60 * 60 * 1000
        ).getTime(),
      },
      process.env.TOKEN_SECREATE
    );
  }

  /**
   * This method will decode the token
   * @param {Token String} token
   * @returns
   */
  static async match(token) {
    let result = "";
    jwt.verify(token, process.env.TOKEN_SECREATE, (err, decoded) => {
      if (err) {
        result = null;
        return;
      }
      result = decoded;
    });
    return result;
  }
}

module.exports = Token;
