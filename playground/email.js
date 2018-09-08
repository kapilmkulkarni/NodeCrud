var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secureConnection: true,
  port:587,
  transportMethod: 'SMTP',
  auth: {
    user: 'yjshah1996@gmail.com',
    pass: 'yashjayeshshah1'
  }
});

var mailOptions = {
  from: ' "Admin" <donotreply@24klen.com>',
  to: 'yash.shah@encureit.com',
  subject: 'Hellooo',
  text: 'Practice......'
  // attachments: [{'filename': 'attachment.txt', 'content': data}]
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log(info.response);
  }
}); 
