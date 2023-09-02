const mongoose=require("mongoose");

const orderschema=new mongoose.Schema({
    order_id:{
        type : String,
        required : true
    },
    customer_name:{
        type:String,
        required:true
    },
    order_items:[
        {
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
            }

        }
    ],
    order_status:{
        type:String,
        required:true,
        default:"Placed"
    },
    total_amount:{
        type:Number,
        required:true
    },
    purchase_date:{
        type:Date,
        default:new Date,
        required:true
    },
    delivery_date: {
        type: Date,
        default: function() {
            // Calculate delivery date by adding 10 days to the purchase date
            const deliveryDate = new Date(this.purchase_date);
            deliveryDate.setDate(deliveryDate.getDate() + 10);
            return deliveryDate;
        },
        required: true
    },
    delivery_address:{
        type:Object,
        required:true
    },
    payment_method:{
        type:String,
        required:true
    },
    transaction_id:{
        type:String
    }
    
});


const orderCollection = new mongoose.model("orderDetails",orderschema);
module.exports = orderCollection;