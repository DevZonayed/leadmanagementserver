const AsyncHandler = require("express-async-handler");

/**
 * @route "/api/v1/mail/send"
 * @desc "This Controler is for Send Mail
 * @Access { Private }
 * @method "POST"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const sendMail = AsyncHandler((req, res, next) => {
  const { mails, mailSub, message, type } = req.body;

  res.status(200).json({
    message: "Mail Send Success",
    data: {
      mails,
      mailSub,
      message,
      type,
    },
  });
});

module.exports = { sendMail };
