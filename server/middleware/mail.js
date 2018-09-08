var nodemailer = require('nodemailer');

module.exports = function mail(email, message, subject) {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      secureConnection: true,
      port: 587,
      transportMethod: 'SMTP',
      auth: {
        user: 'yjshah1996@gmail.com',
        pass: 'yashjayeshshah1'
    }
});

    let mailOptions = {
      from: ' "Admin" <yjshah1996@gmail.com>',
      to: email,
      subject: subject,
      html: message
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return reject(error);
      } else {
        return resolve(info.response);
      }
    });

  })
}



