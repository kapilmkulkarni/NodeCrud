// var client = require('twilio')('ACc51160f130bb9bc5bc75ff0cb5cfeb97','e381fbb3cc3e6d0c420e00edc1fdbe0b');

// // const SendOtp = require('sendotp');
// // const sendOtp = new SendOtp('e381fbb3cc3e6d0c420e00edc1fdbe0b');

// var otp=Math.floor((Math.random() * 100000) + 1);
// console.log('otp:',otp);

// client.messages.create({
//     to:'+919673067099',
//     from:'+14158959147',
//     body:`Your Otp is ${otp}.`
// },function(err,data){
//     if(err){
//         console.log(err);
//     }else{
//         console.log('Message Sent');
//     }
// });




    var otp = "";
    var chars = "1234567890";
    var string_length = 4;
    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        console.log('aaa',rnum);
        otp += chars.substring(rnum, rnum + 1);
    }
console.log('otp',otp);
    // var otp = Math.floor((Math.random() * 10000) + 1);
