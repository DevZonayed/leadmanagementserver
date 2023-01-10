const AsyncHandler = require("express-async-handler");

/**
 * @route "/api/v1/message/send"
 * @desc "This Controler is for Send Message
 * @Access { Private }
 * @method "POST"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const sendMessage = AsyncHandler((req, res, next) => {
  const { numbers, message } = req.body;

  res.status(200).json({
    message: "Message Send Success",
    data: {
      numbers,
      message,
    },
  });
});

module.exports = { sendMessage };
