var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var flash = require('connect-flash');

var UserSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
            minlength: 1,
            trim: true,
            unique: true,
            validate: {
                validator: validator.isEmail,
            },
            message: `{VALUE} is not valid`
        },

        fbid:{
            type:String
        },
        fbtoken:{
            type:String
        },
        fbemail:{
            type:String
        },
        fbname:{
            type:String
        },
        
        password: {
            type: String,
            minlength: 6,
            default:null

        },
        tokens: [{
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }],


     
    
},
    { timestamps: true },
    { collections: 'yash' }
);

UserSchema.pre('save', function (next) {
    console.log('in preeeee');

    var user = this;

    if (user.isModified('password')) {
        console.log('in ifffff');

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        });

    } else {
        console.log('in else');
        next();
    }
})

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAutoToken = function () {
    // console.log('in method');
    var user = this;
    var access = "auth";
    var token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc1234444').toString();

    user.tokens.push({ access, token });
    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function (token) {
    var user = this;
    console.log('qqqqqqqqqqqqqqqqqqqqqqqqq',token);
    return user.update({
        $pull: {
            tokens: { token }
        }
    });
};

// UserSchema.methods.insertFacebook = function (profile, accessToken) {
//     // console.log(';;;;;;;;;;;;;;;;in insertFacebook',profile);   
//     var user = this;
//     // user.facebook.id = profile.id;
//     // user.facebook.token = accessToken;
//     // user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
//     // user.facebook.fbemail = profile.emails[0].value;

//     return User.findOne({ 'facebook.id': profile.id }, function (err, user) {
//         if (err)
//             return err;
//         if (user) {
//             return user;
//         }
//         else {

//             // id = profile.id;
//             // token = accessToken;
//             // name = profile.name.givenName + ' ' + profile.name.familyName;
//             // fbemail = profile.emails[0].value;
//             // user.facebook.push({id, token, fbemail, name});


//             console.log('////////', user);
//             user.save().then(() => {
//                 return user;
//             }, (err) => {
//                 return err;
//             })
//             // console.log(profile);
//         }
//     });

//     //////////////////////////////////////
//     // user.tokens.push({ access, token });
//     // return user.save().then(() => {
//     //     return token;
//     // });
// };

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc1234444');
    } catch (error) {
        return Promise.reject();
    }


    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCrediantials = function (email, password) {
    var User = this;
    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject('Invalid Email');
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject('invalid password');
                }
            })
        })
    });
}



var User = mongoose.model('User', UserSchema);

module.exports = { User };