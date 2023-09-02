
const mongoose=require("mongoose");
const adminSchema=new mongoose.Schema({
    admin_name:{
        type:String,
        required:true
    },
    admin_email:{
        type:String,
        required:true
    },
    admin_password:{
        type:String,
        required:true
    }
})

const admincollection= new mongoose.model("adminData",adminSchema);

module.exports=admincollection;