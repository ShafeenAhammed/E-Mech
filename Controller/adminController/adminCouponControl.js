const couponCollection = require("../../Model/couponDetails");
const { v4: uuidv4 } = require('uuid');

module.exports = {
    // load coupon management
    couponManagement: async (req, res) => {
        try {
            const dataPerPage = 2;
            const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameter

            const totalCount = await couponCollection.countDocuments();
            const totalPages = Math.ceil(totalCount / dataPerPage);
            const startIndex = (page - 1) * dataPerPage;

            const data = await couponCollection.find().skip(startIndex).limit(dataPerPage).exec();

            res.render('couponManagement', { data, currentPage: page, totalPages });
        } catch (err) {
            console.error('Error retrieving data', err);
            res.status(500).send('Internal Server Error');
        }
    },
    //load add coupon page
    loadAddCoupon: async (req, res) => {
        res.render('addCoupon');
    },
    // add coupon
    addCoupon: async (req, res) => {
        try {
            data = {
                coupon_Code: uuidv4(),
                coupon_Name: req.body.coupon_Name,
                min_purchaseamt: req.body.minPurchaseAmt,
                coupon_DiscoutPercentage: req.body.coupon_DiscoutPercentage,
                coupon_MaxAmount: req.body.coupon_MaxAmount,
                coupon_Count: req.body.coupon_Count,
                exp_date: req.body.exp_date


            }

            const checkIdExist = await couponCollection.findOne({ coupon_Code: req.body.coupon_Code });
            const checkNameExist = await couponCollection.findOne({ coupon_Name: req.body.coupon_Name });
            if (checkIdExist) {
                res.render('addCoupon', { msg: "Coupon code already taken" });
            }
            else if (checkNameExist) {
                res.render('addCoupon', { msg: "Coupon name already taken" });
            }
            else {
                await couponCollection.insertMany([data]);
                res.redirect('/admin_panel/coupon_management/add_coupon');
            }

        }
        catch (err) {
            console.log("error in coupon add", err);
        }
    },
    //load edit coupon
    loadEditCoupon: async (req, res) => {
        try {
            const data = await couponCollection.findOne({ coupon_Code: req.query.edit })
            console.log(data);
            res.render('editCoupon', { data });
        }
        catch (err) {
            console.log('Error in product edit load', err);
        }

    },
    // edit coupon
    editCoupon: async (req, res) => {
        try {
            oldData = req.body.coupon_Code;

            const newData = {
                coupon_Code: req.body.coupon_Code,
                coupon_Name: req.body.coupon_Name,
                coupon_DiscoutPercentage: req.body.coupon_DiscoutPercentage,
                coupon_MaxAmount: req.body.coupon_MaxAmount,
                coupon_Count: req.body.coupon_Count,
                exp_date: req.body.exp_date
            };
            await couponCollection.findOneAndUpdate({ coupon_Code: oldData }, newData);
            res.redirect('/admin_panel/coupon_management');
        }
        catch (err) {
            console.log('Error in Edit post', err);
        }
    },
    // enable disable coupon
    softDelete: async (req, res) => {
        const softDel = await couponCollection.findOne({ coupon_Code: req.query.status });

        try {
            if (softDel.coupon_Status === true) {

                await couponCollection.updateOne({ coupon_Code: req.query.status }, { $set: { coupon_Status: false } })
            }
            else {

                await couponCollection.updateOne({ coupon_Code: req.query.status }, { $set: { coupon_Status: true } })
            }
            res.redirect('/admin_panel/coupon_management');

        }
        catch (err) {
            console.log("Problem in coupon enabling", err);
        }
    },
    searchCoupon: async (req, res) => {
        const search = req.query.search;
        try {
            const dataPerPage = 2;
            const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameter
            const totalCount = await couponCollection.countDocuments();
            const totalPages = Math.ceil(totalCount / dataPerPage);
            const startIndex = (page - 1) * dataPerPage;
            const searchResults = await couponCollection.find({ $or: [{ coupon_Name: { $regex: search, $options: 'i' } }, { coupon_Code: { $regex: search, $options: 'i' } }] }).skip(startIndex).limit(dataPerPage).exec();
            if (searchResults == "") {
                res.render('couponManagement', { msg: "No Data!", data: searchResults, currentPage: page, totalPages });
            } else {
                res.render('couponManagement', { data: searchResults, currentPage: page, totalPages });
            }
        }
        catch (err) {
            console.log("Problem in coupon search", err);
        }
    }
}