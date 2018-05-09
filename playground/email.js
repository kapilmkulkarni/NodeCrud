var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secureConnection: true,
  port:587,
  transportMethod: 'SMTP',
  auth: {
    user: 'yashshah2331@gmail.com',
    pass:'yash2331'
  }
});

var mailOptions = {
  from: '"yash" <yashshah2331@gmail.com>',
  to: 'yjshah1996@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
}); 
