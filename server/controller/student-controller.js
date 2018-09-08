var { student } = require('./../models/student');
var client = require('twilio')('ACc51160f130bb9bc5bc75ff0cb5cfeb97', 'e381fbb3cc3e6d0c420e00edc1fdbe0b');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('./../config/auth');
var nodemailer = require('nodemailer');
var sendmail = require('./../middleware/mail');

exports.findall = function (req, res) {

    student.find().then((studs) => {
        res.send(studs)
    }, (e) => {
        res.status(400).send(e);
    })
}

exports.findOne = function (req, res) {
    var id = req.params.id;

    student.findOne({ '_id': id }).then(result => {
        res.json(result);
    }, error => {
        res.status(400).send(error);
    })
}

exports.create = function (req, res) {

    student.find().then(result => {
        var no = result.length;
        let sno = no + 1;

        bcrypt.hash(req.body.password, 10, (error, hash) => {

            if (error) {
                res.status(400).send(error);
            } else {
                console.log(hash)
                var Student = new student();

                Student.sno = sno;
                Student.age = req.body.age;
                Student.sname = req.body.username;
                Student.email = req.body.email;
                Student.password = hash;
                Student.save().then((stud) => {
                    res.status(200).json({ stud, msg: "added to database" });
                }).catch(error => {
                    res.status(400).send(error);
                });
            }
        })
    }).catch(error => {
        res.status(400).send(error);
    })
}

exports.update = (req, res) => {
    var id = req.params.id;
    // console.log(req.body)
    student.findOneAndUpdate({ '_id': id }).then(result => {

        result.age = req.body.age ? req.body.age : result.age;
        result.sname = req.body.sname ? req.body.sname : result.sname;
        result.email = req.body.email ? req.body.email : result.email;
        result.save().then(data => {
            res.status(200).json({ msg: "Data Updated" });
        });
    }).catch(error => {
        console.log('///////////', error)
        res.status(400).send(error);
    })
}

exports.login = (req, res) => {
    student.findOne({ email: req.body.username }).then(data => {
        if (!data) {
            res.status(404).json({ message: "User Not Found!" })
        } else {

            bcrypt.compare(req.body.password, data.password, (error, result) => {
                if (error) {
                    return res.status(400).send(error);
                }
                if (result == true) {
                    // console.log(data.toJSON() ,'///' , data.toObject());
                    var token = jwt.sign(data.toJSON(), config.SECRET_KEY, {
                        expiresIn: '8h' // 1 week
                    });

                    res.status(200).json({
                        success: true,
                        user: data,
                        token: 'JWT ' + token
                    })
                } else {
                    res.status(401).json({
                        error: "Wrong Password"
                    });
                }
            })
        }
    }).catch(error => {
        res.status(400).send(error);
    })
}

exports.forgot_password_mail = (req, res) => {

    student.findOne({ 'email': req.body.email }).then(result => {
        if (!result) {
            res.error('User Not Found');
        }
        if (result) {
            // console.log(result)


            var randomstring = '';
            var chars = "123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
            var string_length = 20;
            for (var i = 0; i < string_length; i++) {
                var rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum, rnum + 1);
            }
            var data = { randomstring: randomstring, email: req.body.email }
            var token = jwt.sign(data, config.SECRET_KEY, { expiresIn: '1h' }); // 2=2 seconds or  in quotes'1h' = 1 hour , '1d' = 1 day            

            const url = `http://localhost:4200/forgot_reset_password?token=${token}`;

            sendmail(req.body.email,
                `
                 <html>
                    <head>
                        <title>Forget Password Email</title>
                    </head>
                    <body>
                        <div>
                            <h3>Dear ${result.sname},</h3>
                            <a href="${url}">${url}</a>
                            <p>You requested for a password reset, kindly use this <a href="${url}">link</a> to reset your password</p>
                            <br>
                            <p>Cheers!</p>
                        </div>                    
                    </body>
                </html>
                 
                 ` ,
                'Password help has arrived!').then(data => {
                    res.status(200).json({ msg: 'trueeeeeeeeeeeeee' });
                }).catch(error => {
                    console.log(error);
                    res.status(400).send(error);
                })
        }
    }).catch(error => {
        res.status(400).send(error);
    })
}

exports.check_reset_password = (req, res) => {

    if (req.body.password == req.body.confirmPassword) {
        const decoded = jwt.verify(req.body.token, config.SECRET_KEY, (error, token) => {
            console.log(error, '//////////////////', token)
            student.findOneAndUpdate({ 'email': token.email }).then(data => {
                data.password = req.body.password;

            }).catch(error => {
                res.status(400).json(error);
            })
        })
        res.status(200).json({ Success: true, msg: "okkkkkkkkkk" });
    } else {
        res.status(422).send({
            message: 'Passwords do not match'
        });
    }

}

// exports.module.={
//     insertStudent,
//     getStudents
// }