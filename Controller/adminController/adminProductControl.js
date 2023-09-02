const categoryCollection = require("../../Model/categoryDetails");
const productCollection = require("../../Model/productDetails");

const { v4: uuidv4 } = require("uuid");

module.exports = {
  // load product management
  productManagement: async (req, res) => {
    try {
      const dataPerPage = 2;
      const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameter

      const totalCount = await productCollection.countDocuments();
      const totalPages = Math.ceil(totalCount / dataPerPage);
      const startIndex = (page - 1) * dataPerPage;
      const data = await productCollection
        .aggregate([
          {
            $lookup: {
              from: "categorydetails",
              localField: "product_category",
              foreignField: "category_name",
              as: "category_info",
            },
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
              category_enabled: { $arrayElemAt: ["$category_info.enabled", 0] },
            },
          },
          {
            $skip: startIndex,
          },
          {
            $limit: dataPerPage,
          },
        ])
        .exec();

      res.render("productManagement", { data, currentPage: page, totalPages });
    } catch (err) {
      console.error("Error retrieving data", err);
      res.status(500).send("Internal Server Error");
    }
  },
  //load add product
  loadAddProduct: async (req, res) => {
    const categoryData = await categoryCollection
      .find({}, { category_name: 1, _id: 0 })
      .exec();
    res.render("addProduct", { categoryData });
  },
  // add product
  addProduct: async (req, res) => {
    const data = {
      product_id: uuidv4(),
      product_name: req.body.product_name,
      product_price: req.body.product_price,
      product_description: req.body.product_description,
      product_category: req.body.product_category,
      product_stock: req.body.product_stock,
      product_image: req.files.map((f) => f.filename),
    };
    try {
      const checkIdExist = await productCollection.findOne({
        product_id: req.body.product_id,
      });
      const checkNameExist = await productCollection.findOne({
        product_name: req.body.product_name,
      });
      if (checkIdExist) {
        res.render("addProduct", { msg: "Product id already taken" });
      } else if (checkNameExist) {
        res.render("addProduct", { msg: "Product name already taken" });
      } else {
        await productCollection.insertMany([data]);
        res.redirect("/admin_panel/product_management/add_product");
      }
    } catch (err) {
      console.log(err, "Can't add product ");
    }
  },
  //load edit product page
  loadEditProduct: async (req, res) => {
    try {
      // console.log(req.query.edit);
      const categoryData = await categoryCollection
        .find({}, { category_name: 1, _id: 0 })
        .exec();
      const data = await productCollection.findOne({
        product_id: req.query.edit,
      });
      res.render("editProduct", { data, categoryData });
    } catch (err) {
      console.log("Error in product edit load", err);
    }
  },
  //edit product
  editProduct: async (req, res) => {
    try {
      oldData = req.body.product_id;
      const newData = {
        product_id: req.body.product_id,
        product_name: req.body.productName,
        product_price: req.body.productPrice,
        product_description: req.body.productDescription,
        product_category: req.body.productCategory,
        product_stock: req.body.productStock,
        
      };
      if (req.files && req.files.length > 0) {
        newData.product_image = req.files.map((f) => f.filename);
      }
      // console.log(newData);
      await productCollection.findOneAndUpdate(
        { product_id: oldData },
        newData
      );
      res.redirect("/admin_panel/product_management");
    } catch (err) {
      console.log("Error in Edit post", err);
    }
  },
  // dlete product image
  deleteProductImage: async (req, res) => {
    try {
      const dImg = req.query.dImg;
      const dId = req.query.dId;
      console.log("img", dImg);
      await productCollection.updateOne(
        { product_id: dId },
        { $pull: { product_image: dImg } }
      );
      const categoryData = await categoryCollection
        .find({}, { category_name: 1, _id: 0 })
        .exec();
      const data = await productCollection.findOne({ product_id: dId });
      // res.redirect('/admin_panel/product_management/edit_product');
      res.render("editProduct", { data, categoryData });
    } catch (err) {
      console.log(err);
    }
  },
  searchProduct: async (req, res) => {
    const search = req.query.search;
    try {
      const dataPerPage = 2;
      const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameter

      const totalCount = await productCollection.countDocuments();
      const totalPages = Math.ceil(totalCount / dataPerPage);
      const startIndex = (page - 1) * dataPerPage;

      const searchResults = await productCollection
        .find({
          $or: [
            { product_name: { $regex: search, $options: "i" } },
            { product_id: { $regex: search, $options: "i" } },
          ],
        })
        .skip(startIndex)
        .limit(dataPerPage)
        .exec();
      if (searchResults == "") {
        res.render("productManagement", {
          msg: "No Data!",
          data: searchResults,
          currentPage: page,
          totalPages,
        });

      } else {
        res.render("productManagement", {
          data: searchResults,
          currentPage: page,
          totalPages,
        });

      }
    } catch (err) {
      console.log("Problem in product search");
    }
  },

  // delete category(soft)
  softDelete: async (req, res) => {
    const softDel = await productCollection.findOne({
      product_id: req.query.delete,
    });

    try {
      if (softDel.enabled === true) {
        await productCollection.updateOne(
          { product_id: req.query.delete },
          { $set: { enabled: false } }
        );
      } else {
        await productCollection.updateOne(
          { product_id: req.query.delete },
          { $set: { enabled: true } }
        );
      }
      res.redirect("/admin_panel/product_management");
    } catch (err) {
      console.log("Problem in product enabling", err);
    }
  },
};
