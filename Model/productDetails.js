const mongoose=require("mongoose");

const productschema=new mongoose.Schema({
    product_id:{
        type : String,
        required : true
    },
    product_name : {
        type : String,
        required : true
    },
    product_price: {
        type : Number,
        required: true
    }
    ,
    product_description : {
        type : String,
        required: true
    },
    
    product_category : {
        type : String,
        required : true
    },
    product_stock: {
        type : Number,
        required: true
    }
    ,
    
    product_image:{
        type : [String],
        required: true
    },
    added_date:{
        type: Date,
        default: Date.now
    },
    enabled:{
        type: Boolean,
        default:true
    }
});

const productCollection = new mongoose.model("productDetails",productschema);
module.exports = productCollection;