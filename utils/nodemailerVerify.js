const nodemailer = require("nodemailer");

module.exports.sendingMail = async ({ from, to, subject, text }) => {
  try {
    let mailOptions = {
      from,
      to,
      subject,
      text,
    };
    //asign createTransport method in nodemailer to a variable
    //service: to determine which email platform to use
    //auth contains the senders email and password which are all saved in the .env
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "cd0cd8c5153ea0",
        pass: "0a0259f9c8842a",
      },
    });

    //return the Transporter variable which has the sendMail method to send the mail
    //which is within the mailOptions
    console.log(transport);
    return await transport.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
