// const admincollection = require("../Model/adminDetails");
// const categoryCollection = require("../Model/categoryDetails");
// const productCollection = require("../Model/productDetails");
// const usercollection = require("../Model/userDetails");


// const { v4: uuidv4 } = require('uuid');


// module.exports={



//     //load admin signin
//     loadAdminSignin : async(req,res)=>{
//         res.render('adminLogin');
//     },

//     // load admin homepage

//     loadAdminHomePage : async (req,res) =>{
//         try{
//             res.render("adminHomePage");
//         }
//         catch(err){
//             console.log(err);
//         }
//     },

//     // admin signin

//     adminSignIn: async (req,res)=>{
//         try{
//             // console.log(req.body.username);
//             const check= await admincollection.findOne({admin_name:req.body.admin_name})
//             if (check.admin_password === req.body.admin_password) {
//                 // const admin=check.admin_name;
//                 // console.log("sign in val",admin);
//                 console.log("chehcking",check.admin_name);
                
//                 res.status(200).redirect(`/adminotp_verification?admin=${check.admin_name}`)
//             }else{
//                 res.status(500).render('adminLogin',{msg:"Invalid Password!"});
//             }
//         }
//         catch(err){
//             res.status(500).send("Wrong username")
//         }
//     },
//     // show all users
//     userManagement: async (req, res) => {
//         try {
//           const dataPerPage = 2; 
//           const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameter
      
//           const totalCount = await usercollection.countDocuments();
//           const totalPages = Math.ceil(totalCount / dataPerPage);
//           const startIndex = (page - 1) * dataPerPage;
      
//           const data = await usercollection.find().skip(startIndex).limit(dataPerPage).exec();
      
//           res.render('userManagement', { data, currentPage: page, totalPages });
//         } catch (err) {
//           console.error('Error retrieving data', err);
//           res.status(500).send('Internal Server Error');
//         }
//       },
//     // user blocking and unblocking
//     userBlock : async(req,res)=>{
//         try{
//             const data = await usercollection.find({username : req.query.username});
//             if(data[0].isBlocked === false){
//                 await usercollection.updateOne({username: req.query.username},{$set:{isBlocked:true}});
//             }else{
//                 await usercollection.updateOne({username: req.query.username},{$set:{isBlocked:false}})
//             }
//             res.redirect('/admin_panel/user_management');
//         }
//         catch(err){
//             console.log(err);
//         }
//     },
//     // user search
    
  

//     // load category management
    
//     categoryManagement : async (req,res)=>{
//         try {
//             const dataPerPage = 2; 
//             const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameter
        
//             const totalCount = await usercollection.countDocuments();
//             const totalPages = Math.ceil(totalCount / dataPerPage);
//             const startIndex = (page - 1) * dataPerPage;
        
//             const data = await categoryCollection.find().skip(startIndex).limit(dataPerPage).exec();
        
//             res.render('categoryManagement', { data, currentPage: page, totalPages });
//           } catch (err) {
//             console.error('Error retrieving data', err);
//             res.status(500).send('Internal Server Error');
//           }
//     },
//     //load add category
//     loadAddCategory : async(req,res)=>{
//         res.render('addCategory');
//     },
//     // add category
//     addCategory : async (req,res)=>{
//         const data={
//             category_id:uuidv4(),
//             category_name:req.body.category_name,
//             category_description:req.body.category_description,
//             category_image:req.file.filename
//         };
    
//         try{
//             const checkIdExist=await categoryCollection.findOne({category_id:req.body.category_id});
//             const checkNameExist=await categoryCollection.findOne({category_name:req.body.category_name});
//             if(checkIdExist){
//                 res.render('addCategory',{msg:"Category id already taken"});
//             }
//             else if(checkNameExist){
//                 res.render('addCategory',{msg:"Category name already taken"});
//             }
//             else{
//                 await categoryCollection.insertMany([data]);
//                 res.redirect('/admin_panel/category_management');
//             }
            
//         }
//         catch(err){
//             console.log(err,"Can't add category ")
//         }
        
//     },
//     // load edit category
//     loadEditCategory: async (req,res)=>{
//         try{
//             console.log(req.query.edit);
            
//             const data= await categoryCollection.findOne({category_id:req.query.edit})
//             console.log(data);
//             res.render('editCategory',{data});
//         }
//         catch(err){
//             console.log("Error in category edit load",err);
//         }
//     },
//     // edit category
//     editCategory: async (req,res)=>{
//         try{
//             oldData=req.body.category_id;
//             // console.log(req.body);
//             // const categoryimage = req.body.existingImages ? req.body.existingImages : req.file.filename;
//             // console.log(categoryimage);
//             // console.log(req.file.filename);
//             const newData={
//                 category_id:req.body.category_id,
//                 category_name:req.body.category_name,
//                 category_description:req.body.category_description,
//                 category_image:req.file.filename
//             };
//             console.log(newData);
//             await categoryCollection.findOneAndUpdate({category_id:oldData},newData);
//             console.log(newData.category_description);
//             res.redirect('/admin_panel/category_management')
//         }
//         catch(err){
//             console.log("Error in category edit",err);
//         }
//     },
//     deleteCategoryImage: async (req,res)=>{
//         try{
//             const dImg = req.query.dImg;
//             const dId = req.query.dId;
//             console.log("img",dImg);
//             await categoryCollection.updateOne(
//                 { category_id: dId }, 
//                 { $unset: { category_image: dImg } } 
//             );
//             const data= await categoryCollection.findOne({category_id:dId});
//             // res.redirect('/admin_panel/product_management/edit_product');
//             res.render('editCategory',{data});
//         }
//         catch(err){
//             console.log("Error in dlt cat img",err);
//         }
//     },

//     // load product management
//     productManagement : async(req,res)=>{
//         try {
//             const dataPerPage = 2; 
//             const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameter
        
//             const totalCount = await usercollection.countDocuments();
//             const totalPages = Math.ceil(totalCount / dataPerPage);
//             const startIndex = (page - 1) * dataPerPage;
        
//             const data = await productCollection.find().skip(startIndex).limit(dataPerPage).exec();
        
//             res.render('productManagement', { data, currentPage: page, totalPages });
//           } catch (err) {
//             console.error('Error retrieving data', err);
//             res.status(500).send('Internal Server Error');
//           }
//     },
//     //load add product
//     loadAddProduct : async(req,res)=>{
//         const categoryData = await categoryCollection.find({},{category_name:1,_id:0}).exec(); 
//         // console.log(categoryData);
//         res.render('addProduct',{categoryData});
//     },
//     // add product
//     addProduct : async(req,res)=>{
//         const data={
//             product_id:uuidv4(),
//             product_name:req.body.product_name,
//             product_price:req.body.product_price,
//             product_description:req.body.product_description,
//             product_category: req.body.product_category,
//             product_stock:req.body.product_stock,
//             product_image:req.files.map((f)=>f.filename)
//         };
//         // console.log(req.files);
//         try{
//             const checkIdExist=await productCollection.findOne({product_id:req.body.product_id});
//             const checkNameExist=await productCollection.findOne({product_name:req.body.product_name});
//             if(checkIdExist){
//                 res.render('addCategory',{msg:"Product id already taken"});
//             }
//             else if(checkNameExist){
//                 res.render('addCategory',{msg:"Product name already taken"});
//             }
//             else{
//                 await productCollection.insertMany([data]);
//                 res.redirect('/admin_panel/product_management/add_product');
//             }
            
//         }
//         catch(err){
//             console.log(err,"Can't add product ")
//         }
//     },
//     //load edit product page
//     loadEditProduct: async(req,res)=>{
//         try{
//             // console.log(req.query.edit);
//             const categoryData = await categoryCollection.find({},{category_name:1,_id:0}).exec();
//             const data= await productCollection.findOne({product_id:req.query.edit})
//             console.log(data);
//             res.render('editProduct',{data,categoryData});
//         }
//         catch(err){
//             console.log('Error in product edit load',err);
//         }
        
//     },
//     editProduct : async(req,res)=>{
//         try{
//             oldData=req.body.product_id;
//             console.log(req.body);
//             const newData={
//                 product_id:req.body.product_id,
//                 product_name:req.body.productName,
//                 product_price:req.body.productPrice,
//                 product_description:req.body.productDescription,
//                 product_category: req.body.productCategory,
//                 product_stock:req.body.productStock,
//                 product_image:req.files.map((f)=>f.filename)
//             };
//             // console.log(newData);
//             await productCollection.findOneAndUpdate({product_id:oldData},newData);
//             res.redirect('/admin_panel/product_management');
//         }
//         catch(err){
//             console.log('Error in Edit post',err);
//         }
//     },
//     deleteProductImage: async(req,res)=>{
//         try {
//             const dImg = req.query.dImg;
//             const dId = req.query.dId;
//             console.log("img",dImg);
//             await productCollection.updateOne(
//                 { product_id: dId }, 
//                 { $pull: { product_image: dImg } } 
//             );
//             const categoryData = await categoryCollection.find({},{category_name:1,_id:0}).exec();
//             const data= await productCollection.findOne({product_id:dId});
//             // res.redirect('/admin_panel/product_management/edit_product');
//             res.render('editProduct',{data,categoryData});
//         }
//         catch(err){
//             console.log(err);
//         }
//     },
//     searchUser : async (req,res)=>{
//         const search= req.query.search;
//         // console.log(search);
//         try{
//             const searchResults= await usercollection.find({$or:[{username:{$regex:search,$options:'i'}},{email:{$regex:search,$options:'i'}}]})
//             // console.log(searchResults);
//             if(searchResults == ""){
//                 // console.log("no data");
//                 res.render('userManagement',{msg:"No Data!",data:searchResults});
//                 // if(req.session.admin){
                    
//                 // }
//             }else{
//                 res.render('userManagement',{data:searchResults});
//                 // if(req.session.admin){
                    
//                 // }
//             }
//         }
//         catch(err){
//             console.log("Problem in user search");
//         }
//     },
//     searchProduct : async (req,res)=>{
//         const search= req.query.search;
//         // console.log(search);
//         try{
//             const searchResults= await productCollection.find({$or:[{product_name:{$regex:search,$options:'i'}},{product_id:{$regex:search,$options:'i'}}]})
//             // console.log(searchResults);
//             if(searchResults == ""){
//                 // console.log("no data");
//                 res.render('productManagement',{msg:"No Data!",data:searchResults});
//                 // if(req.session.admin){
                    
//                 // }
//             }else{
//                 res.render('productManagement',{data:searchResults});
//                 // if(req.session.admin){
                    
//                 // }
//             }
//         }
//         catch(err){
//             console.log("Problem in product search");
//         }
//     },
//     searchCategory : async (req,res)=>{
//         const search= req.query.search;
//         // console.log(search);
//         try{
//             const searchResults= await categoryCollection.find({$or:[{category_name:{$regex:search,$options:'i'}},{category_id:{$regex:search,$options:'i'}}]})
//             // console.log(searchResults);
//             if(searchResults == ""){
//                 // console.log("no data");
//                 res.render('categoryManagement',{msg:"No Data!",data:searchResults});
//                 // if(req.session.admin){
                    
//                 // }
//             }else{
//                 res.render('categoryManagement',{data:searchResults});
//                 // if(req.session.admin){
                    
//                 // }
//             }
//         }
//         catch(err){
//             console.log("Problem in category search");
//         }
//     },
//     deleteProduct : async (req,res)=>{
//         const deleteProduct= req.query.delete;
//         // console.log(deleteProduct);
//         try{
//             await productCollection.findOneAndDelete({product_id:deleteProduct});
//             res.redirect('/admin_panel/product_management')
//         }
//         catch(err){
//             console.log(err);
//         }
//     },
//     deleteCategory : async (req,res)=>{
//         const deleteCategory= req.query.delete;
//         // console.log(deleteCategory);
//         try{
//             await categoryCollection.findOneAndDelete({category_id:deleteCategory});
//             res.redirect('/admin_panel/category_management')
//         }
//         catch(err){
//             console.log(err);
//         }
//     },
//     adminLogout: async (req,res)=>{
//         req.session.destroy(function(err){
//             if(err){
//                 console.log(err);
//                 res.send("Error");
//             }else{
//                 console.log("logged");
//                 res.render('adminLogin',{logout:"Logged out successfully"});
//             }
//         })
//     }
// }