
const mongoose=require("mongoose");

const userschema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    name:{
        type: String,
        required:true
    },
    useremail:{
        type:String,
        required:true
    },
    userpassword:{
        type:String,
        required:true
    },
    userContact : {
        type : Number,
        required : true
    },
    useraddress:[{
        name:{
            type:String
        },
        mobile:{
            type: Number
        },
        houseNumber:{
            type:String
        },
        area:{
            type:String
        },
        city:{
            type:String
        },
        pincode:{
            type:Number
        },
        state:{
            type:String
        }
    }],
    // wishlist:{
    //     type:[String]
    // },
    wishlist: [{
        product_id:{
            type:String
        },
        product_name:{
            type:String
        },
        product_price:{
            type:Number
        },
        product_image:{
            type : String,
            
        }
    }],
    cart:[{
        product_id:{
            type:String
        },
        product_name:{
            type:String
        },
        product_price:{
            type:Number
        },
        product_image:{
            type:String
        },
        product_quantity:{
            type:Number,
            default:1
        }
    }],
    walletbalance:{
        type:Number,
        default:0
    },
    wallethistory: [
        {   
            process:{
                type: String // Payment or TopUp or Refund
            },  
            amount: {
                type:Number
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    isBlocked: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type:Boolean,
        default: false
    }
    
})

const usercollection= new mongoose.model("userData",userschema);

module.exports=usercollection;