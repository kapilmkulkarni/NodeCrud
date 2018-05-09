var { student } = require('./../models/student');
var client = require('twilio')('ACc51160f130bb9bc5bc75ff0cb5cfeb97','e381fbb3cc3e6d0c420e00edc1fdbe0b');


var getStudents= function(req, res){

    student.find().then((studs)=>{
        res.send(studs)
    },(e)=>{
        res.status(400).send(e);
    })
}

var insertStudent=function(req,res){

    var Student=new student(req.body);

    Student.save().then((stud)=>{
        res.status(200).send(stud);
    },(e)=>{
        res.status(400).send(e);
    });

}
module.exports={
    insertStudent,
    getStudents
}