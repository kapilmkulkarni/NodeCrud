var express = require('express');
var router = express.Router();
var StudentCtrl = require('./../controller/student-controller');
var { authenticate } = require('./../middleware/authenticate');


router
    .route('/')
    .get(StudentCtrl.findall)
    .post(StudentCtrl.create)



router.post('/login' ,StudentCtrl.login)

router.get('/findone/:id', authenticate, StudentCtrl.findOne);

router.post('/update/:id', authenticate, StudentCtrl.update);

router.post('/forgot_password_mail', StudentCtrl.forgot_password_mail)

router.post('/check_reset_password', StudentCtrl.check_reset_password)


module.exports = { router };