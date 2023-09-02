const usercollection = require("../../Model/userDetails");

const { v4: uuidv4 } = require('uuid');
module.exports={
    // show all users
    userManagement: async (req, res) => {
        try {
          const dataPerPage = 2; 
          const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameter
      
          const totalCount = await usercollection.countDocuments();
          const totalPages = Math.ceil(totalCount / dataPerPage);
          const startIndex = (page - 1) * dataPerPage;
      
          const data = await usercollection.find().skip(startIndex).limit(dataPerPage).exec();
      
          res.render('userManagement', { data, currentPage: page, totalPages });
        } catch (err) {
          console.error('Error retrieving data', err);
          res.status(500).send('Internal Server Error');
        }
      },
    // user blocking and unblocking
    userBlock : async(req,res)=>{
        try{
            const data = await usercollection.find({username : req.query.username});
            if(data[0].isBlocked === false){
                await usercollection.updateOne({username: req.query.username},{$set:{isBlocked:true}});
            }else{
                await usercollection.updateOne({username: req.query.username},{$set:{isBlocked:false}})
            }
            res.redirect('/admin_panel/user_management');
        }
        catch(err){
            console.log(err);
        }
    },
    // user search
    searchUser : async (req,res)=>{
        const search= req.query.search;
        
        try{
            const dataPerPage = 2; 
            const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameter
        
            const totalCount = await usercollection.countDocuments();
            const totalPages = Math.ceil(totalCount / dataPerPage);
            const startIndex = (page - 1) * dataPerPage;
      
            const searchResults= await usercollection.find({$or:[{username:{$regex:search,$options:'i'}},{email:{$regex:search,$options:'i'}}]}).skip(startIndex).limit(dataPerPage).exec();
            
            if(searchResults == ""){
                
                res.render('userManagement',{msg:"No Data!",data:searchResults, currentPage: page, totalPages});
                 
                
            }else{
                res.render('userManagement',{data:searchResults, currentPage: page, totalPages});
                
            }
        }
        catch(err){
            console.log("Problem in user search");
        }
    },
    loadUserDetails: async (req,res)=>{
        try{
            const data= await usercollection.findOne({username:req.query.username});
            
            res.render('userDetails',{data});
        }
        catch(err){
            console.log("Error in load user details",err);
        }
        
    }
}