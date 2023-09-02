// const userAuth = require("../Middleware/userAuth");
// const usercollection = require("../Model/userDetails");
// const productCollection = require("../Model/productDetails");
// const categoryCollection= require("../Model/categoryDetails");



// module.exports={
//     // load user sign up
//     loadUserSignUp : async (req,res)=>{
//         res.render('signup',{title:"E-Mech"})
//     },

//     // new user sign up
//     userSignUp: async (req,res)=>{
//         const data={
//             username:req.body.username,
//             useremail:req.body.useremail,
//             userpassword:req.body.userpassword,
//             userContact:req.body.userContact
//         };
    
//         try{
//             const checkNameExist=await usercollection.findOne({username:req.body.username});
//             const checkEmailExist=await usercollection.findOne({useremail:req.body.useremail});
//             if(checkNameExist){
//                 // console.log("name ex");
//                 res.render('signup',{msg:"User name already taken"});
//             }
//             else if(checkEmailExist){
//                 // console.log("email ex");
//                 res.render('signup',{msg:"Email already taken"});
//             }
//             else{
//                 await usercollection.insertMany([data]);
//                 req.session.user= req.body.username;
//                 res.redirect("/otp_verification");
//             }
            
//         }
//         catch(err){
//             console.log(err,"Can't sign up")
//         }
        
//     },
//     //load user signin
//     loadUserSignin : async(req,res)=>{
//         res.render('userSignIn');
//     },

//     // load user homepage
//     userhomepage : async(req,res) => {
//         try{
//             if(req.session.user){
//                 userDetails= await usercollection.find({username:req.session.user});
//                 category= await categoryCollection.find();
//                 products = await productCollection.find();
//                 res.render("userHomePage",{userDetails,category,products});
//             }
            
//         }
//         catch(err){
//             console.log("error home");
//             console.log(err);
//         }
//     },
//     //user login
//     userSignIn: async (req,res)=>{
//         try{
//             // console.log(req.body.username);
//             const check= await usercollection.findOne({username:req.body.username})
//             if (check.userpassword === req.body.userpassword && check.isVerified === true) {
//                 req.session.user = check.username;
//                 // console.log(req.session.user);
//                 res.status(200).redirect("/user_homepage")
//             }else if(check.userpassword === req.body.userpassword){
//                 // console.log(check.username);
//                 req.session.username=check.username;
//                 res.redirect("/otp_verification");
                
//             }
//             else{
                
//                 res.status(500).render('userSignIn',{msg:"Invalid Password!"});
//             }
//         }
//         catch(err){
            
//             res.status(500).send("Wrong username")
//         }
//     },
//     userLogout: async (req,res)=>{
//         req.session.destroy(function(err){
//             if(err){
//                 console.log(err);
//                 res.send("Error");
//             }else{
//                 // console.log("logged");
//                 res.redirect('/');
//             }
//         })
//     },
//     forgotPassLoad: async(req,res)=>{
//         res.render("forgotPasswordPage");
//     },

//     forgotPass: async (req,res)=>{
//         try{
//             const check= await usercollection.findOne({username:req.body.username});
//             if(check.userContact==req.body.userContact){
//                 req.session.temp=req.body.username;
//                 res.redirect('/passwordotp_verification');
//             }else{
//                 res.render('forgotPasswordPage',{msg:"Mobile number not matching"})
//             }
//         }
//         catch(err) {
//             // console.log(err);
//             res.render('forgotPasswordPage',{msg:"Invalid user name"})
//         }
//     },
//     passotpVerification: async (req, res) => {
//         try {
//             if (req.session.otp === req.body.otp) {
//                 res.status(200).redirect("/password_reset");
//                 console.log("otp crct");
//             }else{
//                 console.log("otp not crct");
//             }
//         }
//         catch(err){
//             console.log(err);
//         }
//     },
    
//     PassResetLoad: async(req,res)=>{
//         res.render("passwordResetPage");
//     },
//     verifyPassReset: async(req,res)=>{
//        try{
//         await usercollection.updateOne({username:req.session.temp},{$set:{userpassword:req.body.userpassword}});
//         res.redirect('/user_signin');
//        }
//        catch(err) {
//         console.log(err);
//        }
//     },
//     search: async (req,res)=>{
//         const search=req.query.search;
//         try{
//             const userDetails= await usercollection.find({username:req.session.user});
//             const searchResults= await productCollection.find({$or:[{product_name:{$regex:search,$options:'i'}},{product_id:{$regex:search,$options:'i'}}]})
//             // console.log(searchResults);
//             if(searchResults == ""){
//                 // console.log("no data");
//                 res.render('allproductsPage',{msg:"No Data!",data:searchResults,userDetails});
//             }else{
//                 res.render('allproductsPage',{data:searchResults});
                
//             }
//         }
//         catch(err){
//             console.log(err);
//         }
//     },
//     loadproductPage: async (req,res)=>{
//         try{
//             const userDetails= await usercollection.find({username:req.session.user});
//             const prodDetails= await productCollection.find({product_id:req.query.id});
//             res.render('productPage',{prodDetails,userDetails});
             
//         }
//         catch(err){
//             console.log(err);
//         }
//     },
//     loadcategoryPage: async (req,res)=>{
//         try{
//             const userDetails= await usercollection.find({username:req.session.user});
//             const data= await productCollection.find({product_category:req.query.name});
//             if(data.length===0){
//                 // console.log("nulllllll");
//                 res.render('categoryPage',{msg:"No products in this category",data,userDetails});
//             }else{
//                 res.render('categoryPage',{data});
//             }
           
//         }
//         catch (err){
//             console.log(err);
//         }
//     },
//     loadAllproducts: async(req,res)=>{
//         try{
//             data = await productCollection.find();
//             res.render('allproductsPage',{data});
//         }
//         catch(err){
//             console.log(err);
//         }
//     }
// }