var express=require('express');
var router=express.Router();
var StudentCtrl=require('./../controller/student-controller');

router
.route('/')
.get(StudentCtrl.getStudents)
.post(StudentCtrl.insertStudent);

module.exports={router};