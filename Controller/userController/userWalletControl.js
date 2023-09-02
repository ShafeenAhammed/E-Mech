const usercollection = require("../../Model/userDetails");
const { v4: uuidv4 } = require('uuid');
const Razorpay = require('razorpay');

module.exports={
    //load wallet
    loadWallet: async(req,res)=>{
        try{
            const userDetails = await usercollection.find({ username: req.session.user });
            let totalProducts = 0;
            for (let i = 0; i < userDetails[0].cart.length; i++) {
                totalProducts += userDetails[0].cart[i].product_quantity;
            }
            res.render('wallet',{userDetails,totalProducts});
        }
        catch(err){
            console.log("Error in loading wallet",err);
        }
    },
    // top-up wallet
    topUpWallet:async(req,res)=>{
        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_ID_KEY,
            key_secret: process.env.RAZORPAY_SECRET_KEY
        });
        try{
            const topUpAmount=req.body.topUpAmount;
            const user= await usercollection.findOne({username:req.session.user});
            const amount = topUpAmount * 100
            const options = {
                amount: amount,
                currency: 'INR',
                receipt: 'razorUser@gmail.com'
            }

            razorpayInstance.orders.create(options,
                (err, order) => {
                    if (!err) {
                        res.status(200).send({
                            // method:'UPI',
                            success: true,
                            amount: amount,
                            key_id: process.env.RAZORPAY_ID_KEY,
                            contact: "9074916473",
                            name: req.session.user,
                            email: user.useremail,
                            topUpAmount:topUpAmount
                            
                        });
                    }
                    else {
                        console.log(err);
                        res.status(400).send({ success: false, msg: 'Something went wrong!' });
                    }
                }
            );
            
        }
        catch(err){
            console.log("Error in topping up",err);
        }
    },
    // verifying 
    verifyTopUp:async (req,res)=>{
        try{
            // console.log("body",req.body);
            const topUpAmount=req.body.topUpAmount;
            const user = await usercollection.findOne({ username: req.session.user });
            await usercollection.updateOne({username:req.session.user},{ $inc: { walletbalance: topUpAmount }});
            // wallet history
            user.wallethistory.push({
                process: "TopUp",
                amount: topUpAmount
            });
            await user.save();
            res.status(200).send({success:true});
        }
        catch(err){
            console.log("error in verifying topup",err);
        }
    },
    // wallet history
    loadWalletHistory: async(req,res)=>{
        try{
            const userDetails = await usercollection.find({ username: req.session.user });
            let totalProducts = 0;
            for (let i = 0; i < userDetails[0].cart.length; i++) {
                totalProducts += userDetails[0].cart[i].product_quantity;
            }
            // const user = await usercollection.findOne({ username: req.session.user });
            res.render('walletHistory',{userDetails,totalProducts});
        }
        catch(err){
            console.log("Error in loading wallet history",err);
        }
    }
}