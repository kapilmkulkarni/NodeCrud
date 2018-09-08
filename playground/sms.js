var client = require('twilio')('ACc51160f130bb9bc5bc75ff0cb5cfeb97', 'e381fbb3cc3e6d0c420e00edc1fdbe0b');
var request=require('request');
// var arr = ["+919673067099","+918149274716","+918390067760"];

// arr.forEach(function(value){console.log(value)

// client.messages.create({
//     to:'+919673067099',
//     from:'+14158959147',
//     body:'Jay Maharastra!!!'
// },function(err,data){
//     if(err){
//         console.log(err);
//     }else{
//         console.log('Message Sent');
//     }
// });

// client.calls.create({
//     url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+919673067099',
//     from: '+14158959147',
// }, function (err, call) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(call.sid);
//     }
// });

request({
    url: 'http://bhashsms.com/api/sendmsg.php?user=ClotheSpa&pass=ClotheSpa&sender=CltSpa&phone=9673067099&text=SMS&priority=ndnd&stype=normal',
    method: 'post',
}, function(error, response, data){
    if(error) {
        res.status(400).json({ message: 'Invalid Phone Number' });
    } else {
        res.status(200).json(response.statusCode,{ data, Message: 'Verify The Number!' });
    }
});

client.messages.create({
    // to: `+91${phone}`,
    // from: '+14158959147',
    // body: `Your Otp is ${otp}.`
    url: 'http://bhashsms.com/api/sendmsg.php?user=ClotheSpa&pass=ClotheSpa&sender=CltSpa&phone=9673067099&text=TestSMS&priority=Priority&stype=smstype',
    method: 'GET',
}, function (err, data) {
    if (err) {
        res.status(400).json({ message: 'Invalid Phone Number' });
    } else {
        res.status(200).json({ data, Message: 'Verify The Number!' });
    }
});

// });
