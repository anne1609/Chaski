const nodemailer = require("nodemailer");
const config = require("./config")[process.env.NODE_ENV || "development"];

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: config.email.user, 
    pass: config.email.pass, 
  },
});

module.exports = transporter;