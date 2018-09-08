// var pdf=require('pdfkit');
// var fs=require('fs');

// var myDoc=new pdf;

// myDoc.pipe(fs.createWriteStream('node1.pdf'));

// myDoc
//     .text('Node PDF Document',100,100);

//     myDoc.end();

    // var a=(Math.random() * 100000 )
    // console.log(a);
    // var otp = Math.floor(a+ 11);
    // console.log(otp);

// var express = require('express')
// var cors = require('cors')
// var app = express()
 
// app.use(cors())
 
// app.get('/products/:id', function (req, res, next) {
//   res.json({msg: 'This is CORS-enabled for all origins!'})
// })
 
// app.listen(80, function () {
//   console.log('CORS-enabled web server listening on port 80')
// })
// var string="";
var randomstring="";

var chars = "123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
        var string_length = 6;
        for (var i=0; i<string_length; i++) {
          var rnum = Math.floor(Math.random() * chars.length);   
         randomstring += chars.substring(rnum,rnum+1);
          
        }
        console.log('randomstring',randomstring);


        (req, res) => {
            var header1 = req.header('x-auth');
            var header = localStorage.getItem('auth');
    
            // if (header == null) {
            //     res.json("You have to logged in!");
            // } else 
            if (JSON.stringify(header) === JSON.stringify(header1)) {
                var Email = JSON.parse(localStorage.getItem('Email'));
                User.findOne({ Email }).then((user) => {
                    if (!user) {
                        res.json({ Message: "You have to Logged In!!" });
                    } else {
                        res.json(user);
                    }
                });
            } else {
                res.json({ Message: "You have to logged in!!!" });
            }
        }