const mongoose=require("mongoose");

const bannerschema=new mongoose.Schema({
    banner_id:{
        type : String,
        required : true
    },
    banner_name : {
        type : String,
        required : true
    },
    banner_description : {
        type : String,
        required: true
    },
    banner_image:{
        type : String,
        required: true
    },
    enabled:{
        type: Boolean,
        default:true
    }
});

const bannerCollection = new mongoose.model("bannerDetails",bannerschema);
module.exports = bannerCollection;