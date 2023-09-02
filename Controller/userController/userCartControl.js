const categoryCollection = require("../../Model/categoryDetails");
const productCollection = require("../../Model/productDetails");
const usercollection = require("../../Model/userDetails");

module.exports={
    // laod cart
    loadCart: async(req,res)=>{
        try{
            const userDetails= await usercollection.find({username:req.session.user});
            let totalProducts=0;
            for(let i=0;i<userDetails[0].cart.length;i++){
                totalProducts+=userDetails[0].cart[i].product_quantity;
            }
            res.render('cart',{userDetails,totalProducts,msg:""});
        }
        catch(err){
            console.log("load cart error",err);
        }
    },
    // add to cart
    addToCart: async (req,res)=>{

            
        try{
            
            const userDetails= await usercollection.findOne({username:req.session.user},{_id:1});
            const prod= await productCollection.findOne({product_id:req.query.prodData});
            const data={
                product_id:prod.product_id,
                product_name:prod.product_name,
                product_price:prod.product_price,
                product_image:prod.product_image[0],
                
            }
                    //---pushing data to wishlist--
            // userDetails.cart.push(data);
            // await userDetails.save();
            await usercollection.findByIdAndUpdate(
                userDetails,
                { $push: { cart: data } },
                { new: true } // Set { new: true } to return the updated user after the update
            );
          
            // console.log(userDetails.wishlist[0].product_id);
            res.redirect(`/product_page?id=${data.product_id}&user=${req.session.user}`);
        }
        catch(err){
            console.log("Error in add to cart",err);
        }
    },
    //delete cart
    deleteCart : async (req,res)=>{
        const deleteProduct= req.query.delete;
        console.log(deleteProduct);
        try{
            await usercollection.findOneAndUpdate({username:req.session.user},{$pull:{cart:{ product_id: deleteProduct }}});
            res.redirect('/cart')
        }
        catch(err){
            console.log("Error in dlte cart",err);
        }
    },
    // increment qty
    incrementQuantity: async(req,res)=>{
        try{
            const userDetails= await usercollection.find({username:req.session.user});
            let totalProducts=0;
            for(let i=0;i<userDetails[0].cart.length;i++){
                totalProducts+=userDetails[0].cart[i].product_quantity;
            }
            const product = await productCollection.findOne({product_id:req.query.id},{product_stock:1,_id:0});
            // console.log(product);
            const qty=  await usercollection.findOne({'cart.product_id':req.query.id},{'cart.product_quantity.$': 1,_id:0});
            if(qty.cart[0].product_quantity<product.product_stock){
                await usercollection.updateOne(
                    { 'cart.product_id': req.query.id },
                    { $inc: { 'cart.$.product_quantity': 1 } }
                );
                res.redirect('/cart');
            }else{
                // res.redirect('/cart?msg=Stock%20limit%20reached');
                res.render('cart',{userDetails,totalProducts,msg:"Stock limit reached",id:req.query.id})
            }
           
            
        }
        catch(err){
            console.log("Error in cart inc",err);
        }
    },
    // decrement qty
    decrementQuantity: async(req,res)=>{
        try{
            
            const qty=  await usercollection.findOne({'cart.product_id':req.query.id},{'cart.product_quantity.$': 1,_id:0});
            
            if(qty.cart[0].product_quantity>1){
                await usercollection.updateOne(
                    { 'cart.product_id': req.query.id },
                    { $inc: { 'cart.$.product_quantity': -1 } }
                  );
            }
            
            res.redirect('/cart');
        }
        catch(err){
            console.log("Error in cart dec",err);
        }
    }
    
}