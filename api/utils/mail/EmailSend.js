// Import dependencies
const nodemailer = require("nodemailer");

async function sendMail({ to, sub = "From SoroBindu Menagement", data }) {
  // Configure Transport
  var transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL,
    // you can try with TLS, but port is then 587
    auth: {
      user: "znyd320@gmail.com", // Your email id
      pass: "lwpnsjkfhiymmrpo", // Your password
    },
  });
  //======================

  let messageInfo = await transport.sendMail({
    from: "leadmanagement@sorobindu.com",
    to,
    subject: sub,
    html: `<h2>
        Congratulations You have added to soroBindu Menagement Application
      </h2>
      <p><b>Phone:</b> ${data?.phone}</p>
      <p><b>Email:</b> ${data?.email}</p>
      <p><b>Password:</b> ${data?.password}</p>
      `,
  });
  return messageInfo;
}

module.exports = sendMail;
