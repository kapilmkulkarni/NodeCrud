var mongoose=require('mongoose');

var student=mongoose.model('student',{
    sno:{
        type:Number,
        default:null,
        unique:true
    },
    sname:{
        type:String,
        required:true,
        trim:true
    },
    age:{
        type:Number,
        default:null
    }
    
});
module.exports={student};