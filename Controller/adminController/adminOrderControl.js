const orderCollection = require("../../Model/orderDetails");
const categoryCollection = require("../../Model/categoryDetails");
const productCollection = require("../../Model/productDetails");
const usercollection = require("../../Model/userDetails");

module.exports={
    // load order management
    loadOrderManagement: async(req,res)=>{
        try{
            const dataPerPage = 2; 
            const page = parseInt(req.query.page) || 1;
            const totalCount = await orderCollection.countDocuments();
            const totalPages = Math.ceil(totalCount / dataPerPage);
            const startIndex = (page - 1) * dataPerPage;
        
            const data = await orderCollection.find().skip(startIndex).limit(dataPerPage).exec();
        
            res.render('orderManagement', { data, currentPage: page, totalPages });
            } 
            
        
        catch(err){
            console.log("error in laoding order management",err);
        }
    },
    // loadOrderDetails
    loadOrderDetails:async(req,res)=>{
        try{
            const order = await orderCollection.findOne({order_id:req.query.id})
            res.render('orderDetails',{order});
        }
        catch(err){
            console.log("Error in laoding order details",err);
        }
    },
    // update order details
    updateOrderDetails: async(req,res)=>{
        try{
            const order = await orderCollection.findOne({order_id:req.body.orderId})
            const delDateObj = new Date();                        
            const deliveryDate = delDateObj.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            });

            if(req.body.status=="Delivered"){
                await orderCollection.updateOne({order_id:req.body.orderId},{$set:{order_status:req.body.status,delivery_date:delDateObj}});
            }else{
                
                await orderCollection.updateOne({order_id:req.body.orderId},{$set:{order_status:req.body.status}});
            }
            res.render('orderDetails',{order})

        }
        catch(err){
            console.log("Error in updating order",err);
        }
    }
}