const mongoose=require("mongoose");

const categoryschema=new mongoose.Schema({
    category_id:{
        type : String,
        required : true
    },
    category_name : {
        type : String,
        required : true
    },
    category_description : {
        type : String,
        required: true
    },
    category_image:{
        type : String,
        required: true
    },
    enabled:{
        type: Boolean,
        default:true
    }
});

const categoryCollection = new mongoose.model("categoryDetails",categoryschema);
module.exports = categoryCollection;