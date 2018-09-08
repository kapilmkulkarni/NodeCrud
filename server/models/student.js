var mongoose = require('mongoose');
var validator=require('validator');

var student = mongoose.model('student', {
    sno: {
        type: Number,
        default: null,
        unique: true
    },
    sname: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: (value) => {

                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid Email'
        }
    },
    username: {
        type: String,
        trim: true
    },
    password: {
        type: String
    },

});
module.exports = { student };