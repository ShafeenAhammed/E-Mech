const categoryCollection = require("../../Model/categoryDetails");
const orderCollection = require("../../Model/orderDetails");
const productCollection = require("../../Model/productDetails");
const usercollection = require("../../Model/userDetails");
const couponCollection = require("../../Model/couponDetails");
const { v4: uuidv4 } = require('uuid');
const Razorpay = require('razorpay'); 
require("dotenv").config();

module.exports={
    // load checkout page
    loadCheckoutPage: async (req,res)=>{
        try{
            const coupons= await couponCollection.find();
            const userDetails = await usercollection.find({ username: req.session.user });
            let totalProducts = 0;
            for (let i = 0; i < userDetails[0].cart.length; i++) {
                totalProducts += userDetails[0].cart[i].product_quantity;
            }
            res.render('checkoutPage',{userDetails,totalProducts,coupons,couponApplied:false});
        }
        catch(err){
            console.log("Error in loading checkout page",err);
        }
    },
    // applying coupon
    applyCoupon: async (req,res)=>{
        try{
            const coup= req.body.couponCode;
            const total= req.body.total;
            if(!coup){
                res.redirect('/checkout');
            }
            else{
                const coupon= await couponCollection.findOne({coupon_Code:coup});
                const discountAmt= (total*parseFloat(coupon.coupon_DiscoutPercentage)/100);
                let discountedTotal;
                if(discountAmt<coupon.coupon_MaxAmount){
                    discountedTotal= total-discountAmt;
                }else{
                    discountedTotal=total-coupon.coupon_MaxAmount;
                }
                const userDetails = await usercollection.find({ username: req.session.user });
                let totalProducts = 0;
                for (let i = 0; i < userDetails[0].cart.length; i++) {
                    totalProducts += userDetails[0].cart[i].product_quantity;
                }
                res.render('checkoutPage',{userDetails,totalProducts,couponApplied:true,discountedTotal:discountedTotal,discountAmt:discountAmt,couponName:coupon.coupon_Name});
            }

        }
        catch(err){
            console.log("Error in applying coupon",err);
        }
    },
    // removing coupon
    removeCoupon:async (req,res)=>{
        try{
            const userDetails = await usercollection.find({ username: req.session.user });
            let totalProducts = 0;
            for (let i = 0; i < userDetails[0].cart.length; i++) {
                totalProducts += userDetails[0].cart[i].product_quantity;
            }
            const coupons= await couponCollection.find();
            res.render('checkoutPage',{userDetails,totalProducts,coupons,couponApplied:false});
        }
        catch(err){
            console.log("Error in removing coupon",err);
        }
    },
    // payment
    payment: async(req,res)=>{
        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_ID_KEY,
            key_secret: process.env.RAZORPAY_SECRET_KEY
        });
        try{
            const user = await usercollection.findOne({ username: req.session.user });
            const addressIndex= req.body.address;
            const payment=req.body.payment;
            const totalAmount=req.body.total;
            const items= await usercollection.findOne({username:req.session.user},{cart:1,_id:0});
            const address= await usercollection.findOne({username:req.session.user},{useraddress:1,_id:0});
            const userEmail = await usercollection.findOne({ username: req.session.user },{useremail:1,_id:0});
            const useraddress= address.useraddress[addressIndex];
            const data={
                order_id:uuidv4(),
                customer_name: req.session.user,
                order_items:items.cart,
                total_amount:totalAmount,
                delivery_address:useraddress,
                payment_method:payment
            }
            if(payment==="COD"){
                for(const item of items.cart){
                    await productCollection.updateOne({product_id:item.product_id},{$inc:{product_stock:-item.product_quantity}});
                }
                await couponCollection.updateOne({coupon_Name:req.body.couponName},{$inc:{coupon_Count:-1}});
                await usercollection.updateOne({username:req.session.user},{$set:{cart:[]}});
                await orderCollection.insertMany([data]);
                res.status(200).send({success:true,method:'COD'})
            }
            else if(payment==="walletPayment"){
                const walletBalance = await usercollection.findOne({ username: req.session.user },{walletbalance:1,_id:0});
                if(totalAmount<=walletBalance.walletbalance){
                    for(const item of items.cart){
                        await productCollection.updateOne({product_id:item.product_id},{$inc:{product_stock:-item.product_quantity}});
                    }
                    await couponCollection.updateOne({coupon_Name:req.body.couponName},{$inc:{coupon_Count:-1}});
                    await usercollection.updateOne({username:req.session.user},{$set:{cart:[]}});
                    await usercollection.updateOne({username:req.session.user},{$inc:{walletbalance:-totalAmount}});
                    // wallet history
                    user.wallethistory.push({
                        process: "Payment",
                        amount: totalAmount
                    });
                    await user.save();
                    await orderCollection.insertMany([data]);
                    res.status(200).send({success:true,method:'walletPayment',status:true})
                }else{
                    console.log("no balance");
                    res.status(200).send({success:true,method:'walletPayment',status:false,msg:"Insufficient balance in wallet"});
                }
            } 
            else {
                const amount = totalAmount * 100
                const options = {
                    amount: amount,
                    currency: 'INR',
                    receipt: 'razorUser@gmail.com'
                }

                razorpayInstance.orders.create(options,
                    (err, order) => {
                        if (!err) {
                            res.status(200).send({
                                method:'onlinePayment',
                                success: true,
                                amount: amount,
                                key_id: process.env.RAZORPAY_ID_KEY,
                                contact: "9074916473",
                                name: req.session.user,
                                email: userEmail.useremail,
                                data:data
                            });
                        }
                        else {
                            console.log(err);
                            res.status(500).send({ success: false, msg: 'Something went wrong!' });
                        }
                    }
                );
            }
        }
        catch(err){
            console.log("Error in checking out",err);
        }
    },
    // verifying razor pay payment
    verifyPayment: async (req, res) => {
        try {
            const items= await usercollection.findOne({username:req.session.user},{cart:1,_id:0});
            const address= await usercollection.findOne({username:req.session.user},{useraddress:1,_id:0});
            const data=req.body.data;
            data.transaction_id=req.body.razorpayPaymentId;
            data.razorpay_payment_id = req.body.razorpay_payment_id;
            for(const item of items.cart){
                await productCollection.updateOne({product_id:item.product_id},{$inc:{product_stock:-item.product_quantity}});
            }
            await usercollection.updateOne({username:req.session.user},{$set:{cart:[]}});
            await orderCollection.insertMany([data]);
            await couponCollection.updateOne({coupon_Name:req.body.couponName},{$inc:{coupon_Count:-1}});
            res.status(200).send({success:true});
        } catch (err) {
            console.log("Error in verifying payment", err);
            res.status(500).send({ success: false, msg: 'Internal Server Error' });
        }
    }
}