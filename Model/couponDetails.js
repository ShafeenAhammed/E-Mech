const mongoose=require("mongoose");

const couponschema=new mongoose.Schema({
    coupon_Code:{
        type : String,
        required : true
    },
    coupon_Name : {
        type : String,
        required : true
    },
    coupon_DiscoutPercentage: {
        type : String,
        required: true
    }
    ,
    coupon_MaxAmount : {
        type : Number,
        required: true
    },
   
    coupon_Count: {
        type : Number,
        required: true
    }
    ,
    min_purchaseamt:{
        type:Number,
        required:true
    },
  
    exp_date: {
        type: Date,
        default: () => {
            const currentDate = new Date();
            currentDate.setMonth(currentDate.getMonth() + 4);
            return currentDate;
        }
    },
    coupon_Status:{
        type: Boolean,
        default:true
    }
});

const couponCollection = new mongoose.model("couponDetails",couponschema);
module.exports = couponCollection;