const categoryCollection = require("../../Model/categoryDetails");
const productCollection = require("../../Model/productDetails");
const usercollection = require("../../Model/userDetails");

module.exports={
    // product search
    search: async (req,res)=>{
        try {
            // const userDetails= await usercollection.find({username:req.session.user});
            // const searchResults= await productCollection.find({$or:[{product_name:{$regex:search,$options:'i'}},{product_id:{$regex:search,$options:'i'}}]})
            // // console.log(searchResults);
            // if(searchResults == ""){
            //     // console.log("no data");
            //     res.render('allproductsPage',{msg:"No Data!",data:searchResults,userDetails});
            // }else{
            //     res.render('allproductsPage',{userDetails,data:searchResults});

            // }
            
            const itemsPerPage = 2; // Number of products per page
            const page = parseInt(req.query.page) || 1; // Current page number
            const categoryDetails= await categoryCollection.find();
            const userDetails= await usercollection.find({username:req.session.user});
            let totalProducts=0;
            for(let i=0;i<userDetails[0].cart.length;i++){
                totalProducts+=userDetails[0].cart[i].product_quantity;
            }
            const data = await productCollection.aggregate([
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
                        product_description: 1,
                        product_category: 1,
                        product_stock: 1,
                        product_image: 1,
                        enabled: 1,
                        category_enabled: { $arrayElemAt: ["$category_info.enabled", 0] }
                    }
                },
                {
                    $match: {
                        enabled: true,
                        category_enabled: true
                    }
                }
            ]);

            const searchResults = data.filter(item =>
                item.product_name.match(new RegExp(search, 'i')) ||
                item.product_id.match(new RegExp(search, 'i'))
            );

            console.log("here",searchResults);
            if (searchResults == "") {
                // console.log("no data");
                res.render('allproductsPage', { msg: "No Data!", data: searchResults, userDetails,categoryDetails,totalProducts,currentPage:page,totalPages: Math.ceil(searchResults.length / itemsPerPage), session:session });
            } else {
                const searchResultsPaginated = searchResults.slice((page - 1) * itemsPerPage, page * itemsPerPage);
                // res.render('allproductsPage', { userDetails, data: searchResults ,categoryDetails,totalProducts});
                res.render('allproductsPage', {
                    msg: searchResultsPaginated.length === 0 ? "No Data!" : "",
                    data: searchResultsPaginated,
                    userDetails,
                    categoryDetails,
                    totalProducts,
                    currentPage: page,
                    totalPages: Math.ceil(searchResults.length / itemsPerPage),
                    session:session
                });

            }

        }
        catch(err){
            console.log("product search",err);
        }
    },
    //load product page
    loadproductPage: async (req,res)=>{
        try{
            let session;
            let userDetails;
            let totalProducts=0;
            if(req.session.user){
                session= true;
                userDetails= await usercollection.find({username:req.session.user});
                for(let i=0;i<userDetails[0].cart.length;i++){
                    totalProducts+=userDetails[0].cart[i].product_quantity;
                }
            }else{
                session= false;
            }
            
            const prodDetails= await productCollection.find({product_id:req.query.id});
            res.render('productPage',{prodDetails,userDetails,totalProducts,session:session});
             
        }
        catch(err){
            console.log("product page",err);
        }
    },
    //dispaly all products
    loadAllproducts: async(req,res)=>{
        try{
            const userDetails= await usercollection.find({username:req.session.user});
            let totalProducts=0;
            for(let i=0;i<userDetails[0].cart.length;i++){
                totalProducts+=userDetails[0].cart[i].product_quantity;
            }
            const categoryDetails= await categoryCollection.find();
            // Pagination settings
            const itemsPerPage = 2; // Number of products per page
            const page = parseInt(req.query.page) || 1; // Current page number
            // const data = await productCollection.find({enabled:true});
            const data= await productCollection.aggregate([
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
                },
                // Pagination stages
                { $skip: (page - 1) * itemsPerPage },
                { $limit: itemsPerPage }
              ])
            
            console.log("prodcs",data);
            // Calculate total pages for pagination controls
            const allProducts = await productCollection.find().count();
            console.log("All pr",allProducts);
            const totalPages = Math.ceil(allProducts / itemsPerPage);
            console.log(totalPages);
            res.render('allproductsPage',{userDetails,data,categoryDetails,totalProducts,currentPage: page,totalPages:totalPages});
        }
        catch(err){
            console.log("all product",err);
        }
    },
    //displaying products based on filter
    loadFilteredProducts: async (req, res) => {

        try {
            const userDetails = await usercollection.find({ username: req.session.user });
            let totalProducts=0;
            for(let i=0;i<userDetails[0].cart.length;i++){
                totalProducts+=userDetails[0].cart[i].product_quantity;
            }
            const categoryDetails= await categoryCollection.find();
            const itemsPerPage = 4; // Number of products per page
            const page = parseInt(req.query.page) || 1; // Current page number

            // Retrieve the selected price ranges and categories from the request body
            // const priceRanges = req.query.priceRanges || [];
            // const categories = req.query.categories || [];
            const priceRanges = Array.isArray(req.query.priceRanges) ? req.query.priceRanges : [req.query.priceRanges];
            const categories = Array.isArray(req.query.categories) ? req.query.categories : [req.query.categories];
            // console.log("len",priceRanges.length);
            // if (priceRanges=== "" && categories ==="") {
            //     console.log("No filters selected. Redirecting to /all_products");
            //     return res.redirect('/all_products');
            // }

            
            // const noFiltersSelected = priceRanges.length === 0 && categories.length === 0;
            // console.log(noFiltersSelected);

        if (Object.keys(req.query).length === 0) {
            console.log("No filters selected. Redirecting to /all_products");
            return res.redirect('/all_products');
        }

            // console.log("queryy",req.query);
            // console.log("single price",priceRanges);
            // console.log("cat",categories);
            
            const priceRangesArray = [];
        if (priceRanges.includes('under-1000')) {
            priceRangesArray.push({ product_price: { $lt: 1000 } });
        }
        if (priceRanges.includes('1000-to-5000')) {
            priceRangesArray.push({ product_price: { $gte: 1000, $lte: 5000 } });
        }
        if (priceRanges.includes('5000-to-10000')) {
            priceRangesArray.push({ product_price: { $gt: 5000, $lte: 10000 } });
        }
        if (priceRanges.includes('10000-to-15000')) {
            priceRangesArray.push({ product_price: { $gt: 10000, $lte: 15000 } });
        }
        // Add more price range options here if needed

        // Construct the category query based on the selected options
        const categoryFilterQuery = {};
        if (categories.length > 0) {
            categoryFilterQuery.product_category = { $in: categories };
        }
        let data
        if(!categories.length===""){
            console.log("entered");
            data= await productCollection.aggregate([
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
                        category_enabled:true,
                        $and: [...priceRangesArray, categoryFilterQuery]
                        
                    }
                }
              ])
        } else {
            console.log("entered prices");
            console.log("ranges",priceRanges);
            data= await productCollection.aggregate([
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
                        category_enabled:true,
                        $or: [...priceRangesArray, categoryFilterQuery]
                    }
                }
              ])
        }
            
            
           
              console.log("datataa",data);
              console.log("pagege",page);
              const filteredDataPaginated = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
              console.log("filtered prods",filteredDataPaginated);
              res.render('allproductsPage', {
                userDetails,
                data: filteredDataPaginated,
                categoryDetails,
                totalProducts,
                currentPage: page,
                totalPages: Math.ceil(data.length / itemsPerPage)
            });
            // res.render('allproductsPage',{userDetails,data,categoryDetails,totalProducts});
        }
        catch (err) {
            console.log("Error in filtering", err);
        }
    }
}