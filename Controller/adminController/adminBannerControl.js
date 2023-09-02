const bannerCollection = require("../../Model/bannerDetails");
const { v4: uuidv4 } = require('uuid');

module.exports={
    
    bannerManagement : async (req,res)=>{
        try {
            const dataPerPage = 2; 
            const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameter
        
            const totalCount = await bannerCollection.countDocuments();
            const totalPages = Math.ceil(totalCount / dataPerPage);
            const startIndex = (page - 1) * dataPerPage;
        
            const data = await bannerCollection.find().skip(startIndex).limit(dataPerPage).exec();
        
            res.render('bannerManagement', { data, currentPage: page, totalPages });
          } catch (err) {
            console.error('Error retrieving data', err);
            res.status(500).send('Internal Server Error');
          }
    },

    loadAddBanner: async(req,res)=>{
        res.render('addBanner');
    },
    
    addBanner : async (req,res)=>{
        const data={
            banner_id:uuidv4(),
            banner_name:req.body.banner_name,
            banner_description:req.body.banner_description,
            banner_image:req.file.filename
        };
    
        try{
            const checkIdExist=await bannerCollection.findOne({banner_id:req.body.banner_id});
            const checkNameExist=await bannerCollection.findOne({banner_name:req.body.banner_name});
            if(checkIdExist){
                res.render('addbanner',{msg:"banner id already taken"});
            }
            else if(checkNameExist){
                res.render('addbanner',{msg:"banner name already taken"});
            }
            else{
                await bannerCollection.insertMany([data]);
                res.redirect('/admin_panel/banner_management');
            }
            
        }
        catch(err){
            console.log(err,"Can't add banner ")
        }
        
    },
    // load edit banner
    loadEditBanner: async (req,res)=>{
        try{
            console.log(req.query.edit);
            
            const data= await bannerCollection.findOne({banner_id:req.query.edit})
            console.log(data);
            res.render('editbanner',{data});
        }
        catch(err){
            console.log("Error in banner edit load",err);
        }
    },
    // edit banner
    editBanner: async (req,res)=>{
        try{
            oldData=req.body.banner_id;
            // console.log(req.body);
            // const bannerimage = req.body.existingImages ? req.body.existingImages : req.file.filename;
            // console.log(bannerimage);
            // console.log(req.file.filename);
            const newData={
                banner_id:req.body.banner_id,
                banner_name:req.body.banner_name,
                banner_description:req.body.banner_description,
                
            };
            if(req.file){
                newData.banner_image=req.file.filename
            }
            console.log(newData);
            await bannerCollection.findOneAndUpdate({banner_id:oldData},newData);
            console.log(newData.banner_description);
            res.redirect('/admin_panel/banner_management')
        }
        catch(err){
            console.log("Error in banner edit",err);
        }
    },
    deleteBanner : async (req,res)=>{
        const deleteBanner= req.query.delete;
        // console.log(deletebanner);
        try{
            await bannerCollection.findOneAndDelete({banner_id:deleteBanner});
            res.redirect('/admin_panel/banner_management')
        }
        catch(err){
            console.log(err);
        }
    },
    searchbanner : async (req,res)=>{
        const search= req.query.search;
        // console.log(search);
        try{
            const dataPerPage = 2; 
            const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameter
        
            const totalCount = await bannerCollection.countDocuments();
            const totalPages = Math.ceil(totalCount / dataPerPage);
            const startIndex = (page - 1) * dataPerPage;
            const searchResults= await bannerCollection.find({$or:[{banner_name:{$regex:search,$options:'i'}},{banner_id:{$regex:search,$options:'i'}}]}).skip(startIndex).limit(dataPerPage).exec();
            // console.log(searchResults);
            if(searchResults == ""){
                // console.log("no data");
                res.render('bannerManagement',{msg:"No Data!",data:searchResults, currentPage: page, totalPages});
                // if(req.session.admin){
                    
                // }
            }else{
                res.render('bannerManagement',{data:searchResults, currentPage: page, totalPages});
                // if(req.session.admin){
                    
                // }
            }
        }
        catch(err){
            console.log("Problem in banner search",err);
        }
    }

}
