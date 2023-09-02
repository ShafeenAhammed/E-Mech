const categoryCollection = require("../../Model/categoryDetails");

const { v4: uuidv4 } = require('uuid');
const productCollection = require("../../Model/productDetails");
module.exports = {
    // load category management

    categoryManagement: async (req, res) => {
        try {
            const dataPerPage = 2;
            const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameter

            const totalCount = await categoryCollection.countDocuments();
            const totalPages = Math.ceil(totalCount / dataPerPage);
            const startIndex = (page - 1) * dataPerPage;

            const data = await categoryCollection.find().skip(startIndex).limit(dataPerPage).exec();

            res.render('categoryManagement', { data, currentPage: page, totalPages });
        } catch (err) {
            console.error('Error retrieving data', err);
            res.status(500).send('Internal Server Error');
        }
    },
    //load add category
    loadAddCategory: async (req, res) => {
        res.render('addCategory');
    },
    // add category
    addCategory: async (req, res) => {
        const data = {
            category_id: uuidv4(),
            category_name: req.body.category_name,
            category_description: req.body.category_description,
            category_image: req.file.filename
        };

        try {
            const checkIdExist = await categoryCollection.findOne({ category_id: req.body.category_id });
            const checkNameExist = await categoryCollection.findOne({ category_name: req.body.category_name });
            if (checkIdExist) {
                res.render('addCategory', { msg: "Category id already taken" });
            }
            else if (checkNameExist) {
                res.render('addCategory', { msg: "Category name already taken" });
            }
            else {
                await categoryCollection.insertMany([data]);
                res.redirect('/admin_panel/category_management');
            }

        }
        catch (err) {
            console.log(err, "Can't add category ")
        }

    },
    // load edit category
    loadEditCategory: async (req, res) => {
        try {
            console.log(req.query.edit);

            const data = await categoryCollection.findOne({ category_id: req.query.edit })
            console.log(data);
            res.render('editCategory', { data });
        }
        catch (err) {
            console.log("Error in category edit load", err);
        }
    },
    // edit category
    editCategory: async (req, res) => {
        try {
            oldData = req.body.category_id;
            // console.log(req.body);
            // const categoryimage = req.body.existingImages ? req.body.existingImages : req.file.filename;
            // console.log(categoryimage);
            // console.log(req.file.filename);
            const newData = {
                category_id: req.body.category_id,
                category_name: req.body.category_name,
                category_description: req.body.category_description,

            };
            if (req.file) {
                newData.category_image = req.file.filename
            }
            console.log(newData);
            await categoryCollection.findOneAndUpdate({ category_id: oldData }, newData);
            console.log(newData.category_description);
            res.redirect('/admin_panel/category_management')
        }
        catch (err) {
            console.log("Error in category edit", err);
        }
    },
    //delete category image
    deleteCategoryImage: async (req, res) => {
        try {
            const dImg = req.query.dImg;
            const dId = req.query.dId;
            console.log("img", dImg);
            await categoryCollection.updateOne(
                { category_id: dId },
                { $unset: { category_image: dImg } }
            );
            const data = await categoryCollection.findOne({ category_id: dId });
            // res.redirect('/admin_panel/product_management/edit_product');
            res.render('editCategory', { data });
        }
        catch (err) {
            console.log("Error in dlt cat img", err);
        }
    },
    //search category
    searchCategory: async (req, res) => {
        const search = req.query.search;
        // console.log(search);
        try {
            const dataPerPage = 2;
            const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameter

            const totalCount = await categoryCollection.countDocuments();
            const totalPages = Math.ceil(totalCount / dataPerPage);
            const startIndex = (page - 1) * dataPerPage;
            const searchResults = await categoryCollection.find({ $or: [{ category_name: { $regex: search, $options: 'i' } }, { category_id: { $regex: search, $options: 'i' } }] }).skip(startIndex).limit(dataPerPage).exec();
            // console.log(searchResults);
            if (searchResults == "") {
                // console.log("no data");
                res.render('categoryManagement', { msg: "No Data!", data: searchResults, currentPage: page, totalPages });
                // if(req.session.admin){

                // }
            } else {
                res.render('categoryManagement', { data: searchResults, currentPage: page, totalPages });
                // if(req.session.admin){

                // }
            }
        }
        catch (err) {
            console.log("Problem in category search", err);
        }
    },

    // delete category(soft)
    softDelete: async (req, res) => {
        const softDel = await categoryCollection.findOne({ category_id: req.query.delete });
        try {
            if (softDel.enabled === true) {
                await categoryCollection.updateOne({ category_id: req.query.delete }, { $set: { enabled: false } });
            }
            else {
                await categoryCollection.updateOne({ category_id: req.query.delete }, { $set: { enabled: true } });
            }
            res.redirect('/admin_panel/category_management');
        }
        catch (err) {
            console.log("Problem in enabling", err);
        }
    }

}