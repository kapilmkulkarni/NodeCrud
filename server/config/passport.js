var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var { mongoose } = require('./../db/mongoose');
var {User} = require('../models/user');
var configAuth = require('./auth');

module.exports = function (passport) {

	passport.serializeUser(function(user, done) {
		done(null, user);
	  });
	  
	  passport.deserializeUser(function(user, done) {
		done(null, user);
	  });

	passport.use(new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL,
		profileFields: ['id', 'displayName', 'gender', 'email', 'name']
	},
		function (accessToken, refreshToken, profile, done) {
			// console.log('Profile:',profile);
			process.nextTick(function () {
				User.findOne({ 'fbid': profile.id }, function (err, user) {
					if (err)
						
						return done(err);
					if (user)
						return done(null, user);
					else {
						var user = new User();
						user.fbid = profile.id;
						user.fbtoken = accessToken;
						user.fbname = profile.displayName;
						user.fbemail = profile.emails[0].value;
						user.email= profile.emails[0].value;
						 user.save(function (err) {
							if (err)
								throw err;
							return done(null, user);
						})
						// console.log('////////////////////////////', profile);
					}
					

				});

				// var fbprofile={
				// 	id : profile.id,
				// 	token : accessToken,
				// 	name : profile.name.givenName + ' ' + profile.name.familyName,
				// 	fbemail : profile.emails[0].value
				// }

				// console.log('aaaaa',fbprofile);
				// var user= fbprofile;
				//  user= new User(fbprofile);
				// console.log('aaa',user);
				// user.insertFacebook(profile,accessToken).then((user)=>{
				// 	console.log(']]]]]]]]]]]]',user);
				// 	return done(null, user)
				// },(err)=>{
				// 	return done(err);
				// })
				
			});
		}

	));


};