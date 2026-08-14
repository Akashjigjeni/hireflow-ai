require("dotenv").config();

const sendEmail = require("./src/utils/sendEmail");

sendEmail(
  "jigjenia@gmail.com",
  "HireFlow AI Test",
  "🎉 Congratulations! Your email integration is working."
);