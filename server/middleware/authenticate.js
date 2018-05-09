var { User } = require('./../models/user');


var authenticate = (req, res, next) => {
    var headtoken = req.header('x-auth');
    
    User.findByToken(headtoken).then((user) => {
        
        if (!user) {
            return Promise.reject();
        }
        req.user = user;
        req.token = headtoken;
        next();
    }).catch((e) => {
        res.status(401).send();
    })

};

module.exports = { authenticate };