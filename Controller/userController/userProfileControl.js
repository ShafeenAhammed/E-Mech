const categoryCollection = require("../../Model/categoryDetails");
const orderCollection = require("../../Model/orderDetails");
const productCollection = require("../../Model/productDetails");
const usercollection = require("../../Model/userDetails");
const { ObjectId } = require('mongodb');

module.exports={
    // load user profile
    loadUserProfile: async (req,res)=>{
        try {
            const userDetails = await usercollection.find({ username: req.session.user });
            const orders= await orderCollection.find({customer_name:req.session.user}).count();
            let totalProducts = 0;
            for (let i = 0; i < userDetails[0].cart.length; i++) {
                totalProducts += userDetails[0].cart[i].product_quantity;
            }
            res.render('userProfile',{userDetails,totalProducts,orders});
        }
        catch(err){
            console.log("Error in laod user profile",err);
        }
    },
    // load user address page
    loadAddressManagement: async (req,res)=>{
        try {
            const userDetails = await usercollection.find({ username: req.session.user });
            let totalProducts = 0;
            for (let i = 0; i < userDetails[0].cart.length; i++) {
                totalProducts += userDetails[0].cart[i].product_quantity;
            }
            res.render('addressManagement',{userDetails,totalProducts});
        }
        catch(err){
            console.log("Error in load Address management",err);
        }
    },
    // load add address
    loadAddAddress: async(req,res)=>{
        try{
            const userDetails = await usercollection.find({ username: req.session.user });
            let totalProducts = 0;
            for (let i = 0; i < userDetails[0].cart.length; i++) {
                totalProducts += userDetails[0].cart[i].product_quantity;
            }
            res.render('addAddress',{userDetails,totalProducts});
        }
        catch(err){
            console.log("error in loading add address",err);
        }
    },
    // add address
    addAddress: async(req,res)=>{
        try{
            const user= await usercollection.findOne({username:req.session.user},{_id:1});
            const userDetails = await usercollection.find({ username: req.session.user });
            data={
                name:req.body.name,
                houseNumber:req.body.houseNumber,
                area:req.body.area,
                city:req.body.city,
                pincode:req.body.pincode,
                state:req.body.state,
                mobile:req.body.contactNumber
            };
            await usercollection.findByIdAndUpdate(
                userDetails,
                { $push: { useraddress: data } },
                { new: true } // Set { new: true } to return the updated user after the update
            );
            res.redirect('/useraddressmanagement');
        }
        catch(err){
            console.log("Error in adding address",err);
        }
    },
    loadEditAddress: async (req,res)=>{
        try{
            const userDetails = await usercollection.find({ username: req.session.user });
            const address= await usercollection.findOne({username:req.session.user,'useraddress._id':new ObjectId(req.query.id)}, {_id: 0,useraddress: {$elemMatch: { _id: req.query.id }}});
            console.log("addess",address);
            let totalProducts = 0;
            for (let i = 0; i < userDetails[0].cart.length; i++) {
                totalProducts += userDetails[0].cart[i].product_quantity;
            }
            res.render('editAddress',{userDetails,totalProducts,address})
        }
        catch(err){
            console.log("Error in loading edit address page",err);
        }
    },
    editAddress: async(req,res)=>{
        try{
            data={
                name:req.body.name,
                houseNumber:req.body.houseNumber,
                area:req.body.area,
                city:req.body.city,
                pincode:req.body.pincode,
                state:req.body.state,
                mobile:req.body.contactNumber
            };
            await usercollection.updateOne({username:req.session.user,'useraddress._id':new ObjectId(req.body.addressId)},{ $set: { 'useraddress.$': data } });
            res.redirect('/useraddressmanagement');
        }
        catch(err){
            console.log("Error in editing",err);
        }
    },
    deleteAddress: async(req,res)=>{
        try{
            await usercollection.updateOne({username:req.session.user},{ $pull: { useraddress: { _id: new ObjectId(req.query.id) } } });
            res.redirect('/useraddressmanagement');
        }
        catch(err){
            console.log("Error in Deleting address",err);
        }
    },
    loadOrderHistory: async(req,res)=>{
        const ordersPerPage=6;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * ordersPerPage;
        const orders= await orderCollection.find({customer_name:req.session.user,order_status: { $ne: "Placed" }}).skip(skip).limit(ordersPerPage);
        const totalOrders = await orderCollection.find({ customer_name: req.session.user,order_status: { $ne: "Placed" } }).count();
        const totalPages = Math.ceil(totalOrders / ordersPerPage);
        const userDetails = await usercollection.find({ username: req.session.user });
        let totalProducts = 0;
        for (let i = 0; i < userDetails[0].cart.length; i++) {
            totalProducts += userDetails[0].cart[i].product_quantity;
        }
        res.render("orderHistory",{userDetails,totalProducts,orders, totalPages, currentPage: page })
    }
}