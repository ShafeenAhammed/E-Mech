const categoryCollection = require("../../Model/categoryDetails");
const productCollection = require("../../Model/productDetails");
const usercollection = require("../../Model/userDetails");

module.exports={
            // load wishlist
            loadWishList: async (req,res)=>{
                try{
                    const userDetails= await usercollection.find({username:req.session.user});
                    let totalProducts=0;
                    for(let i=0;i<userDetails[0].cart.length;i++){
                        totalProducts+=userDetails[0].cart[i].product_quantity;
                    }
                    res.render('wishlist',{userDetails,totalProducts});
                }
                catch(err){
                    console.log("load Wishlist errror",err);
                }
                
            },
            //add to wishlist
            addToWishList: async (req,res)=>{
    
                
                try{
                    const user= req.query.userData;
                    const userDetails= await usercollection.findOne({username:user},{_id:1});
                    const prod= await productCollection.findOne({product_id:req.query.prodData});
                    const data={
                        product_id:prod.product_id,
                        product_name:prod.product_name,
                        product_price:prod.product_price,
                        product_image:prod.product_image[0]
                    }
                            //---pushing data to wishlist--
                    // userDetails.wishlist.push(data);
                    // await userDetails.save();
                    await usercollection.findByIdAndUpdate(
                        userDetails,
                        { $push: { wishlist: data } },
                        { new: true } // Set { new: true } to return the updated user after the update
                    );
                  
                    // console.log(userDetails.wishlist[0].product_id);
                    res.redirect(`/product_page?id=${data.product_id}&user=${user}`);
                }
                catch(err){
                    console.log("Error in add to wishlist",err);
                }
            },
            // delete wishlist
            deleteWishList : async (req,res)=>{
                const deleteProduct= req.query.delete;
                console.log(deleteProduct);
                try{
                    await usercollection.findOneAndUpdate({username:req.session.user},{$pull:{wishlist:{ product_id: deleteProduct }}});
                    res.redirect('/wishlist')
                }
                catch(err){
                    console.log(err);
                }
            }
}