const orderCollection = require("../../Model/orderDetails");
const usercollection = require("../../Model/userDetails");
const productCollection = require("../../Model/productDetails");
const puppeteer = require('puppeteer');
const PDFDocument = require('pdfkit');
const pdf = require('html-pdf');
const ejs = require('ejs');
const fs = require('fs');
const path = require("path");


module.exports={
    // load order page
    loadOrderPage:async (req,res)=>{
        try{
            const ordersPerPage=6;
            const page = parseInt(req.query.page) || 1;
            const skip = (page - 1) * ordersPerPage;
            const orders= await orderCollection.find({customer_name:req.session.user}).sort({purchase_date:-1}).skip(skip).limit(ordersPerPage);
            const totalOrders = await orderCollection.find({ customer_name: req.session.user }).count();
            const totalPages = Math.ceil(totalOrders / ordersPerPage);
            const userDetails = await usercollection.find({ username: req.session.user });
            let totalProducts = 0;
            for (let i = 0; i < userDetails[0].cart.length; i++) {
                totalProducts += userDetails[0].cart[i].product_quantity;
            }
            res.render("orderPage",{orders,userDetails,totalProducts, totalPages, currentPage: page })
        }
        catch(err){
            console.log("Error in loading orders",err);
        }
    },
    // load order details page
    loadOrderDetails: async(req,res)=>{
        try{
            const userDetails = await usercollection.find({ username: req.session.user });
            let totalProducts = 0;
            for (let i = 0; i < userDetails[0].cart.length; i++) {
                totalProducts += userDetails[0].cart[i].product_quantity;
            }
            const order= await orderCollection.findOne({order_id:req.query.id});
            res.render("orderDetails",{userDetails,totalProducts,order});
        }
        catch(err){
            console.log("Error loading Order details",err);
        }
    },
    //load invoice
    loadInvoice:async (req,res)=>{
        try{
            const userDetails = await usercollection.find({ username: req.session.user });
            let totalProducts = 0;
            for (let i = 0; i < userDetails[0].cart.length; i++) {
                totalProducts += userDetails[0].cart[i].product_quantity;
            }
            const order= await orderCollection.findOne({order_id:req.query.id});
            // console.log(order.delivery_address.name);
            res.render('invoice',{userDetails,totalProducts,order});
        }
        catch(err){
            console.log("error in loading invoice",err);
        }
        
    },
    
    //generate invoice pdf
    
    invoicePDF: async (req, res) => {
        try {
            // console.log(req.query);
            const order = await orderCollection.findOne({ order_id: req.query.id });
            // console.log(order);
            if (!order) {
                return res.status(404).send('Order not found');
            }
            
            const userDetails = await usercollection.find({ username: req.session.user });
            let totalProducts = 0;
            for (let i = 0; i < userDetails[0].cart.length; i++) {
                totalProducts += userDetails[0].cart[i].product_quantity;
            }
    
            const doc = new PDFDocument();
            doc.pipe(fs.createWriteStream('invoice.pdf'));
    
            // Add content to the PDF
            doc.fontSize(15).text('E-Mech Invoice', { align: 'center' });
            doc.text(' ');
            doc.text('--------------------------');
    
            doc.fontSize(12).text('Sold By', { align: 'left' });
            doc.text('E-Mech');
            doc.text('123 Main Street');
            doc.text('TVM, Kerala, 666312');
            doc.text('Phone: 456-7890');
            doc.text('Email: emech@gamil.com');
            doc.text('--------------------------');
            doc.text('--------------------------', { align: 'right' });
    
            doc.text('Shipping Address', { align: 'right' });
            doc.text(order.delivery_address.name, { align: 'right' });
            doc.text(`${order.delivery_address.houseNumber}, ${order.delivery_address.area}`, { align: 'right' });
            doc.text(`${order.delivery_address.city}, ${order.delivery_address.state}, ${order.delivery_address.pincode}`, { align: 'right' });
            doc.text(`Phone: ${order.delivery_address.mobile}`, { align: 'right' });
    
            doc.text('--------------------------', { align: 'right' });
    
            doc.fontSize(12).text(`Order ID: ${order.order_id},`, { align: 'left' });
    
            const dateObj = new Date(order.purchase_date);
            const purchaseDate = dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            doc.text(`Order Date: ${purchaseDate},`, { align: 'left' });
    
            doc.fontSize(12).text(`Invoice Date: ${purchaseDate}`, { align: 'right' });
    
            doc.text('--------------------------');
    
            doc.text('Product                                 Quantity              Unit Price              Total Price');
            doc.text('----------------------------------------------------------------------------------------------------');
    
            for (let i = 0; i < order.order_items.length; i++) {
                const item = order.order_items[i];
                doc.text(`${item.product_name}            ${item.product_quantity}              ${item.product_price}              Rs ${item.product_quantity * item.product_price}`);
                doc.text('-------------------------------------------------------------------------------------------------');
            }
    
            
    
            doc.text(`Total :                               Rs ${order.total_amount}`);
    
            doc.end();
    
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename=invoice.pdf');
            doc.pipe(res);
    
        } catch (err) {
            console.log("error in generating pdf", err);
            res.status(500).send('Error generating PDF');
        }
    },
    // cancel order
    cancelOrder:async(req,res)=>{
        try{
            const order= await orderCollection.findOne({order_id:req.query.id});
            const user = await usercollection.findOne({ username: req.session.user });
            // const userDetails= await usercollection.find({username:req.session.user});
            if(order.payment_method==="onlinePayment"||order.payment_method==="walletPayment"){
                await usercollection.updateOne({username:req.session.user},{$inc:{walletbalance:order.total_amount}});
                // wallet history
                user.wallethistory.push({
                    process: "Refund",
                    amount: order.total_amount
                });
                await user.save();
            }
            for(let i=0;i<order.order_items.length;i++){
                await productCollection.updateOne({product_id:order.order_items[i].product_id},{$inc:{product_stock:order.order_items[i].product_quantity}});
            }
            await orderCollection.updateOne({order_id:req.query.id},{$set:{order_status:"Cancelled"}});
            res.redirect('/orders');

        }
        catch(err){
            console.log("Error in cancelling order",err);
        }
    },
    //load return page
    loadReturnPage:async (req,res)=>{
        try{
            // console.log(req.query.id);
            const userDetails = await usercollection.find({ username: req.session.user });
            let totalProducts = 0;
            for (let i = 0; i < userDetails[0].cart.length; i++) {
                totalProducts += userDetails[0].cart[i].product_quantity;
            }
            res.render('returnPage',{userDetails,totalProducts,order_id:req.query.id});
        }
        catch(err){
            console.log("Error in loading return page",err);
        }
    },
    // return order
    returnOrder:async(req,res)=>{
        try{
            console.log("returning");
            const user = await usercollection.findOne({ username: req.session.user });
            const returnReason=req.body.returnReason;
            const orderId=req.body.orderId
            const order= await orderCollection.findOne({order_id:orderId});
            if(returnReason!=1){
                for(let i=0;i<order.order_items.length;i++){
                    await productCollection.updateOne({product_id:order.order_items[i].product_id},{$inc:{product_stock:order.order_items[i].product_quantity}});
                }
            }
            await orderCollection.updateOne({order_id:orderId},{$set:{order_status:"Returned"}});
            await usercollection.updateOne({username:req.session.user},{$inc:{walletbalance:order.total_amount}});
            // wallet history
            user.wallethistory.push({
                process: "Refund",
                amount: order.total_amount
            });
            await user.save();
            res.redirect('/orders');
        }
        catch(err){
            console.log("Error in returning order",err);
        }
    }
    

}