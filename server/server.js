var express = require('express');
var bodyParser = require('body-parser');
var { ObjectID } = require('mongodb');
var _ = require('lodash');
var nodemailer = require('nodemailer');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var port = process.env.PORT || 3000;

var { mongoose } = require('./db/mongoose');
var { User } = require('./models/user');
var { router } = require('./routes/index');
var { authenticate } = require('./middleware/authenticate');
var configAuth = require('./config/auth');
require('./config/passport')(passport);

var app = express();
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use('/student', router);

app.use(session({
    secret: 'anystringoftext',
    saveUninitialized: true,
    resave: true
}));
app.use(flash());


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
    console.log('-----', req.body);
    User.findByCrediantials(req.body.email, req.body.password).then((user) => {
        return user.generateAutoToken().then((token) => {
            res.header('x-auth', token).send(user).render('profile.ejs');
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
            res.header('x-auth', token).render('index.ejs');
        })
    }).catch((err) => {
        res.status(400).render('signup.ejs', { message: req.flash('Insert Email and pass') });
    });
});

app.get('/auth/facebook',passport.authenticate('facebook', { scope: ['email'] })); 

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));

app.delete('/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.listen(port, () => {
    console.log("Server up at port 3000");
});