const categoryCollection = require("../../Model/categoryDetails");
const productCollection = require("../../Model/productDetails");
const usercollection = require("../../Model/userDetails");

module.exports={
    //laod category page
    loadcategoryPage: async (req,res)=>{
        try{
            const userDetails= await usercollection.find({username:req.session.user});
            const data= await productCollection.find({product_category:req.query.name,enabled:true});
            // const catData= await categoryCollection.find({category_name:req.query.name},{enabled:1,__v:0});
            let totalProducts=0;
            for(let i=0;i<userDetails[0].cart.length;i++){
                totalProducts+=userDetails[0].cart[i].product_quantity;
            }
            if(data.length===0){
                // console.log("nulllllll");
                res.render('categoryPage',{msg:"No products in this category",data,userDetails,totalProducts});
            }else{
                res.render('categoryPage',{userDetails,totalProducts,data});
            }
           
        }
        catch (err){
            console.log(err);
        }
    }
}