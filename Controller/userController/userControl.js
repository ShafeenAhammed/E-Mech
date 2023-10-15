const bannerCollection = require("../../Model/bannerDetails");
const categoryCollection = require("../../Model/categoryDetails");
const productCollection = require("../../Model/productDetails");
const usercollection = require("../../Model/userDetails");


module.exports={
        // load Not Signed In Landing Page
        loadNotSignedInLandingPage:async(req,res)=>{
            try{
                const bannerDetails= await bannerCollection.find();
                const category= await categoryCollection.find({enabled:true});
                const products= await productCollection.aggregate([
                    {
                      $lookup: {
                        from: "categorydetails",
                        localField: "product_category",
                        foreignField: "category_name",
                        as: "category_info"
                      }
                    },
                    {
                      $project: {
                        _id: 1,
                        product_id: 1,
                        product_name: 1,
                        product_price: 1,
                        product_description:1,
                        product_category:1,
                        product_stock:1,
                        product_image:1,
                        enabled:1,
                        category_enabled: { $arrayElemAt: ["$category_info.enabled", 0] }
                        
                      }
                    },
                    {
                        $match:{
                            enabled:true,
                            category_enabled:true
                        }
                    }
                  ])
                res.render('landingPage',{category,products,bannerDetails});
            }
            catch(err){
                console.log("Error in loading not signed landing",err);
            }
        },
        // load user sign up
        loadUserSignUp : async (req,res)=>{
            res.render('signup',{title:"E-Mech"})
        },
    
        // new user sign up
        userSignUp: async (req,res)=>{
            const data={
                username:req.body.username,
                name:req.body.name,
                useremail:req.body.useremail,
                userpassword:req.body.userpassword,
                userContact:req.body.userContact
            };
        
            try{
                const checkNameExist=await usercollection.findOne({username:req.body.username});
                const checkEmailExist=await usercollection.findOne({useremail:req.body.useremail});
                if(checkNameExist){
                    // console.log("name ex");
                    res.render('signup',{msg:"User name already taken"});
                }
                else if(checkEmailExist){
                    // console.log("email ex");
                    res.render('signup',{msg:"Email already taken"});
                }
                else{
                    await usercollection.insertMany([data]);
                    req.session.email=data.useremail;
                    req.session.user= req.body.username;
                    res.redirect("/otp_verification");
                }
                
            }
            catch(err){
                console.log(err,"Can't sign up")
            }
            
        },
        //load user signin
        loadUserSignin : async(req,res)=>{
            res.render('userSignIn');
        },
    
        // load user homepage
        userhomepage : async(req,res) => {
            try{
                if(req.session.user){
                    const bannerDetails= await bannerCollection.find();
                    const userDetails= await usercollection.find({username:req.session.user});
                    const category= await categoryCollection.find({enabled:true});
                    // products = await productCollection.find({enabled:true});
                    let totalProducts=0;
                    for(let i=0;i<userDetails[0].cart.length;i++){
                        totalProducts+=userDetails[0].cart[i].product_quantity;
                    }
                    const products= await productCollection.aggregate([
                        {
                          $lookup: {
                            from: "categorydetails",
                            localField: "product_category",
                            foreignField: "category_name",
                            as: "category_info"
                          }
                        },
                        {
                          $project: {
                            _id: 1,
                            product_id: 1,
                            product_name: 1,
                            product_price: 1,
                            product_description:1,
                            product_category:1,
                            product_stock:1,
                            product_image:1,
                            enabled:1,
                            category_enabled: { $arrayElemAt: ["$category_info.enabled", 0] }
                            
                          }
                        },
                        {
                            $match:{
                                enabled:true,
                                category_enabled:true
                            }
                        }
                      ])

                    res.render("userHomePage",{userDetails,category,products,bannerDetails,totalProducts});
                }
                
            }
            catch(err){
                console.log("error home");
                console.log(err);
            }
        },
        //user login
        userSignIn: async (req,res)=>{
            try{
                // console.log(req.body.username);
                const check= await usercollection.findOne({username:req.body.username})
                if (check.userpassword === req.body.userpassword && check.isVerified === true) {
                    req.session.user = check.username;
                    // console.log(req.session.user);
                    res.status(200).redirect("/user_homepage")
                }else if(check.userpassword === req.body.userpassword){
                    // console.log(check.username);
                    req.session.username=check.username;
                    res.redirect("/otp_verification");
                    
                }
                else{
                    
                    res.status(500).render('userSignIn',{msg:"Invalid Password!"});
                }
            }
            catch(err){
                
                res.status(500).send("Wrong username")
            }
        },
        // user logout
        userLogout: async (req,res)=>{
            req.session.destroy(function(err){
                if(err){
                    console.log(err);
                    res.send("Error");
                }else{
                    // console.log("logged");
                    res.redirect('/');
                }
            })
        },
        //load forgot password page
        forgotPassLoad: async(req,res)=>{
            res.render("forgotPasswordPage");
        },
        //post forgot pw page
        forgotPass: async (req,res)=>{
            try{
                const check= await usercollection.findOne({username:req.body.username});
                if(check.userContact==req.body.userContact){
                    req.session.temp=req.body.username;
                    res.redirect('/passwordotp_verification');
                }else{
                    res.render('forgotPasswordPage',{msg:"Mobile number not matching"})
                }
            }
            catch(err) {
                // console.log(err);
                res.render('forgotPasswordPage',{msg:"Invalid user name"})
            }
        },
        //pw otp verify
        passotpVerification: async (req, res) => {
            try {
                if (req.session.otp === req.body.otp) {
                    res.status(200).redirect("/password_reset");
                    console.log("otp crct");
                }else{
                    res.render('passOTP',{msg:"Incorrect OTP"})
                }
            }
            catch(err){
                console.log(err);
            }
        },
        //load pw reset page
        PassResetLoad: async(req,res)=>{
            res.render("passwordResetPage");
        },
        //pw reset
        verifyPassReset: async(req,res)=>{
           try{
            await usercollection.updateOne({username:req.session.temp},{$set:{userpassword:req.body.userpassword}});
            res.redirect('/user_signin');
           }
           catch(err) {
            console.log(err);
           }
        }
           
}