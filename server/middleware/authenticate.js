var { User } = require('./../models/user');
var jwt = require('jsonwebtoken');
var config = require('./../config/auth');

var authenticate = (req, res, next) => {
    // console.log('ggggggggggggg');

    // var headtoken=req.cookies.xauth;
    // // var headtoken = req.header('x-auth');
    // console.log(headtoken);

    // User.findByToken(headtoken).then((user) => {

    //     if (!user) {
    //         return Promise.reject();
    //     }
    //     req.user = user;
    //     req.token = headtoken;
    //     next();
    // }).catch((e) => {
    //     res.status(401).send();
    // })


    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, config.SECRET_KEY, (error, token) => {
            
            if (error) {
                console.log(error.name,'///////////',error.message,'/////////',error.expiredAt);
                return res.status(401).json({
                    success: false,
                    message: "Token Expired"
                });
            } else {  
                req.userData = token; 
                next();
            }        
        });
        
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Auth Failed"
        });
    }
};

module.exports = { authenticate };