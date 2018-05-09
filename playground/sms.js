var client = require('twilio')('ACc51160f130bb9bc5bc75ff0cb5cfeb97','e381fbb3cc3e6d0c420e00edc1fdbe0b');

// var arr = ["+919673067099","+918149274716","+918390067760"];

// arr.forEach(function(value){console.log(value)

client.messages.create({
    to:'+919673067099',
    from:'+14158959147',
    body:'Jay Maharastra!!!'
},function(err,data){
    if(err){
        console.log(err);
    }else{
        console.log('Message Sent');
    }
});

// });