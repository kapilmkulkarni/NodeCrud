var express = require('express');
var bodyParser = require('body-parser');
var { ObjectID } = require('mongodb');
var _ = require('lodash');
var nodemailer = require('nodemailer');
var Picker = require('picker');
var jwt = require('jsonwebtoken');
var morgan = require('morgan');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var crypto = require('crypto');
var createHash = require('js-sha512');
var payumoney = require('payumoney-node');
var cors = require('cors');
var multer = require('multer');
var upload = multer();
// var XMLHttpRequest= require("xmlhttprequest").XMLHttpRequest;
// var xhr = new XMLHttpRequest();



var { mongoose } = require('./db/mongoose');
var { User } = require('./models/user');
var { router } = require('./routes/index');
var { authenticate } = require('./middleware/authenticate');
var configAuth = require('./config/auth');
require('./config/passport')(passport);
var port = configAuth.PORT || 3000;

var app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(upload.array()); 
app.use(morgan('dev'));

// Picker.middleware(bodyParser.json());
// Picker.middleware(bodyParser.urlencoded({ extended: false }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + '/public'));

////////////////////////////

app.use('/student', router);

///////////////////////////

app.use(session({
    secret: 'anystringoftext',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/////////////////////////////////////////////////////////////////////////////

payumoney.setKeys('F1z7coeW', 'JjckyBbOBD', 'Mf6swfJ/ifF7PGYf5lmGbY5w+Ao78i5GzHb+Ch4EH6s=');
// KEY = "F1z7coeW",
// SALT = "JjckyBbOBD"

// KEY = "gtKFFx",
// SALT = "eCwWELxi"

//generate SHA512 key
app.post('/getShaKey', function (req, res) {

    payumoney.setKeys('F1z7coeW', 'JjckyBbOBD', 'Mf6swfJ/ifF7PGYf5lmGbY5w+Ao78i5GzHb+Ch4EH6s=');
    KEY = "F1z7coeW",
        SALT = "JjckyBbOBD"
    console.log("Hash Generated", req.body);
    var shasum = crypto.createHash('sha512'),
        reqData = req.body,
        dataSequence = KEY + '|' + reqData.txnid + '|' + reqData.amount + '|' + reqData.productinfo + '|' + reqData.firstname + '|' + reqData.email + '|||||||||||' + SALT,
        resultKey = shasum.update(dataSequence).digest('hex');
    console.log(resultKey);
    // res.end(resultKey);
    var paymentData = {
        productinfo: reqData.productinfo,
        txnid: reqData.txnid,
        amount: reqData.amount,
        email: reqData.email,
        phone: reqData.phone,
        firstname: reqData.firstname,
        surl: "http://localhost:3000/success", //"http://localhost:3000/payu/success"
        furl: "http://localhost:3000/cancel", //"http://localhost:3000/payu/fail"
    };

    payumoney.makePayment(paymentData, function (error, response) {
        if (error) {
            res.json({ error });
        } else {
            // Payment redirection link
            console.log(response);
            res.json({ "aaaaaa": response });
        }
    });

});
/////////////////////////////////////////////////////////////////////////////////////////////
// var postRoutes = Picker.filter(function(req, res) {
//     // you can write any logic you want.
//     // but this callback does not run inside a fiber
//     // at the end, you must return either true or false
//     return req.method == "POST";
// });

// app.post('/payment_success', function(params, req, res, next) {
//     var self = res;
//     fs = Npm.require('fs')

//     console.log('Received payment..................');

//     var urlToRedirect = '';
//     if (req.body) {
//         fs.appendFile(Meteor.settings.private.transactionLogFilePath, "Success Start=======================================================================")
//         fs.appendFile(Meteor.settings.private.transactionLogFilePath, JSON.stringify(req.body))
//         fs.appendFile(Meteor.settings.private.transactionLogFilePath, "Success End*************************************************************************")

//         var udf1 = JSON.parse(req.body.udf1.replace(/&amp;quot;/g, '\"'));

//         req.body.userId = udf1.userId;

//         //store transaction in your collection if needed
//         //update user subscription in users collection

//         urlToRedirect = '/thank-you';
//     } else {
//         urlToRedirect = '/error';
//     }
//     self.writeHead(302, {
//         'Location': urlToRedirect
//     });
//     self.end();
// });

// app.post('/payment_failed', function(params, req, res, next) {
//     console.log('Payment failed....');

//     if (req.body) {
//         fs.appendFile(Meteor.settings.private.transactionLogFilePath, "Failed Start=======================================================================")
//         fs.appendFile(Meteor.settings.private.transactionLogFilePath, JSON.stringify(req.body))
//         fs.appendFile(Meteor.settings.private.transactionLogFilePath, "Failed Error*************************************************************************")
//     }

//     var urlToRedirect = '/error';
//     self.writeHead(302, {
//         'Location': urlToRedirect
//     });
//     self.end();
// });
////////////////////////////////////////////////////////////////////////////////////////////
app.post('/success', function (req, res) {
    console.log("==========", req.body.hash);
    var shasum = crypto.createHash('sha512'),
        reqData = req.body,
        dataSequence = SALT + '|' + reqData.status + '|||||||||||' + reqData.email + '|' + reqData.firstname + '|' + reqData.productinfo + '|' + reqData.amount + '|' + reqData.txnid + '|' + KEY,
        resultKey = shasum.update(dataSequence).digest('hex');
    console.log(resultKey);
    if (req.body.hash == resultKey) {
        console.log("==========", req.body);
        var success = {
            mihpayid: reqData.mihpayid,
            addedon: reqData.addedon,
            status: reqData.status,
            txnid: reqData.txnid,
            bank_ref_num: reqData.bank_ref_num,
            mode: reqData.mode,
            net_amount_debit: reqData.net_amount_debit
        }
        res.send({ success });
    } else {
        res.send("SOmething went wrong");
    }

});

app.post('/cancel', (req, res) => {
    res.send(" okkkkkkkkkkk cancel");
});

app.get('/aaa', (req, res) => {

    payumoney.paymentResponse('asc123', function (error, response) {
        if (error) {
            // Some error
        } else {
            console.log("aaaaaaaaaaaaaaaaaa")
            res.send(response);
        }
    })
})


/////////////////////////////////////////////////////////////////////////////
app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/login', (req, res) => {
    res.render('login.ejs', { message: req.flash('loginMessage') });
});

app.post('/login', (req, res) => {
    // var body = _.pick(req.body, ['email', 'password']);
    // res.send(req.body);
    // console.log('-----', req.body);
    var email = req.body.email;
    User.findByCrediantials(req.body.email, req.body.password).then((user) => {
        // console.log('ttttttttttttttttttttt',user);
        return user.generateAutoToken().then((token) => {
            // res.setHeader("x-auth", token);
            res.cookie('xauth', token);
            res.render('profile.ejs', { user: user });

        })

    }).catch((err) => {
        console.log(err);
        res.status(400).render('login.ejs', { message: `${err}` });
    })
});

app.get('/signup', (req, res) => {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
});

app.post('/signup', (req, res) => {
    // var body = _.pick(req.body, ['email', 'password']);
    console.log("/////////", req.body);
    var user = new User(req.body);

    // var transporter = nodemailer.createTransport({
    //     host: 'smtp.gmail.com',
    //     secureConnection: true,
    //     port:587,
    //     transportMethod: 'SMTP',
    //     auth: {
    //       user: 'yashshah2331@gmail.com',
    //       pass:'yash2331'
    //     }
    //   });

    //   var mailOptions = {
    //     from: '"Yash Shah" <yashshah2331@gmail.com>',
    //     to: req.body.email,
    //     subject: 'New User SignUp',
    //     text: `Your Userid: ${req.body.email} and Password :${req.body.password}`
    //   };

    //   transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   }); 

    user.save().then((user) => {
        // res.send(user)    
        // console.log('888888',user.email,'////',user._id);
        return user.generateAutoToken().then((token) => {
            console.log("//////", token);
            res.setHeader("x-auth", token);
            res.redirect('/');
        })
    }).catch((err) => {
        res.status(400).render('signup.ejs', { message: req.flash('Insert Email and pass') });
    });
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));


app.get('/profile', isLoggedIn, function (req, res) {
    res.render('profile.ejs', { user: req.user });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

app.get('/logout', authenticate, (req, res) => {

    console.log('aaaaaaaaa');
    req.user.removeToken(req.token).then((user) => {
        if (user) {
            console.log("in removet");
            res.render('login.ejs', { message: 'Logged Out' });

            // req.logout();
            // res.send({
            //     redirectTO :('/')
            // });
        }
    }, (err) => {
        req.logout();
        res.send({
            redirectTO: ('/')
        });
        // res.render('login.ejs',{message:'Logged Out'});
    });
});
// app.get('/logout/:token', function (req, res) {
//     var id = req.params.token;
//     console.log('qqqqqqqqqqqqqqqq',id);
//     req.logout();
//     res.redirect('/');
// })

////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/yash', (req, res) => {
    var randomstring = '';
    var chars = "123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
    var string_length = 20;
    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    var data = {
        randomstring: randomstring
    }
    var token = jwt.sign(data, '123abc', { expiresIn: 2 }); // 2=2 seconds or  in quotes'1h' = 1 hour , '1d' = 1 day
    const decoded = jwt.verify(token, '123abc');
    res.json({ 'randomstring': randomstring, 'token': token });
})

app.post('/check', (req, res) => {
console.log(req.body)

    res.json("okkkkkkkkkkk");
})



app.listen(port, () => {
    console.log(`Server up at port ${port}`);
});