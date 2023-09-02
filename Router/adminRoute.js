
const adminControl= require("../Controller/adminController/adminControl");
const adminUserControl= require("../Controller/adminController/adminUserControl");
const adminProductControl= require("../Controller/adminController/adminProductControl");
const adminCategoryControl=require("../Controller/adminController/adminCategoryControl");
const adminCouponControl = require("../Controller/adminController/adminCouponControl");
const express= require("express");
const session = require("express-session");
const {v4:uuidv4}= require("uuid");
const multer = require("multer");
const adminAuth = require("../Middleware/adminAuth");
const { islogout } = require("../Middleware/userAuth");
const adminBannerControl = require("../Controller/adminController/adminBannerControl");
const adminOrderControl = require("../Controller/adminController/adminOrderControl");
const adminRoute = express();

adminRoute.use(express.json());
adminRoute.use(express.urlencoded({extended:true}));

adminRoute.use(session({
    secret:uuidv4(),
    resave:false,
    saveUninitialized:true
}));
adminRoute.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './assets/uploads');
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const upload = multer({ storage: storage })

adminRoute.set('view engine', 'ejs')
adminRoute.set('views', './views/admin')

adminRoute.get('/admin_login',adminAuth.islogin,adminControl.loadAdminSignin);
adminRoute.post('/admin_login',adminControl.adminSignIn);
adminRoute.get('/adminotp_verification',adminAuth.islogin,adminAuth.adminotpGenerate);
adminRoute.post('/adminotp_verification',adminAuth.adminotpVerification);
adminRoute.get('/admin_panel',adminAuth.islogout,adminControl.loadAdminHomePage);
adminRoute.get('/getChartData',adminControl.getChartData);

adminRoute.get('/admin_panel/user_management',adminAuth.islogout,adminUserControl.userManagement);
adminRoute.get('/admin_panel/user-details',adminAuth.islogout,adminUserControl.loadUserDetails);
adminRoute.get('/searchuser',adminAuth.islogout,adminUserControl.searchUser);
adminRoute.get('/block',adminAuth.islogout,adminUserControl.userBlock);

adminRoute.get('/admin_panel/category_management',adminAuth.islogout,adminCategoryControl.categoryManagement);
adminRoute.get('/admin_panel/category_management/add_category',adminAuth.islogout,adminCategoryControl.loadAddCategory);
adminRoute.post('/admin_panel/category_management/add_category',adminAuth.islogout,upload.single('category_image'),adminCategoryControl.addCategory);
adminRoute.get('/admin_panel/category_management/edit_category',adminAuth.islogout,adminCategoryControl.loadEditCategory);
adminRoute.post('/admin_panel/category_management/edit_category',upload.single('category_image'),adminCategoryControl.editCategory);
adminRoute.get('/admin_panel/category_management/edit_category/deleteimage',adminAuth.islogout,adminCategoryControl.deleteCategoryImage);
adminRoute.get('/searchcategory',adminAuth.islogout,adminCategoryControl.searchCategory);
adminRoute.get('/enablecategory',adminAuth.islogout,adminCategoryControl.softDelete);

adminRoute.get('/admin_panel/product_management',adminAuth.islogout,adminProductControl.productManagement);
adminRoute.get('/admin_panel/product_management/add_product',adminAuth.islogout,adminProductControl.loadAddProduct);
adminRoute.post('/admin_panel/product_management/add_product',adminAuth.islogout,upload.array('product_image',4),adminProductControl.addProduct);
adminRoute.get('/admin_panel/product_management/edit_product',adminAuth.islogout,adminProductControl.loadEditProduct);
adminRoute.post('/admin_panel/product_management/edit_product',adminAuth.islogout,upload.array('product_image',4),adminProductControl.editProduct);
adminRoute.get('/admin_panel/product_management/edit_product/deleteimage',adminAuth.islogout,adminProductControl.deleteProductImage)
adminRoute.get('/searchproduct',adminAuth.islogout,adminProductControl.searchProduct);
adminRoute.get('/enableproduct',adminAuth.islogout,adminProductControl.softDelete);

adminRoute.get('/admin_panel/order_management',adminAuth.islogout,adminOrderControl.loadOrderManagement);
adminRoute.get('/admin_panel/order-details',adminAuth.islogout,adminOrderControl.loadOrderDetails);
adminRoute.post('/admin_panel/updateorder-details',adminAuth.islogout,adminOrderControl.updateOrderDetails);

adminRoute.get('/admin_panel/coupon_management',adminAuth.islogout,adminCouponControl.couponManagement);
adminRoute.get('/admin_panel/coupon_management/add_coupon',adminAuth.islogout,adminCouponControl.loadAddCoupon);
adminRoute.post('/admin_panel/coupon_management/add_coupon',adminAuth.islogout,adminCouponControl.addCoupon);
adminRoute.get('/admin_panel/coupon_management/edit_coupon',adminAuth.islogout,adminCouponControl.loadEditCoupon);
adminRoute.post('/admin_panel/coupon_management/edit_coupon',adminAuth.islogout,adminCouponControl.editCoupon);
adminRoute.get('/enablecoupon',adminAuth.islogout,adminCouponControl.softDelete);
adminRoute.get('/searchcoupon',adminAuth.islogout,adminCouponControl.searchCoupon);

adminRoute.get('/admin_panel/banner_management',adminAuth.islogout,adminBannerControl.bannerManagement);
adminRoute.get('/admin_panel/banner_management/add_banner',adminAuth.islogout,adminBannerControl.loadAddBanner);
adminRoute.post('/admin_panel/banner_management/add_banner',adminAuth.islogout,upload.single('banner_image'),adminBannerControl.addBanner);
adminRoute.get('/admin_panel/banner_management/edit_banner',adminAuth.islogout,adminBannerControl.loadEditBanner);
adminRoute.post('/admin_panel/banner_management/edit_banner',adminAuth.islogout,upload.single('banner_image'),adminBannerControl.editBanner);
adminRoute.get('/delete_banner',adminAuth.islogout,adminBannerControl.deleteBanner);
adminRoute.get('/searchbanner',adminAuth.islogout,adminBannerControl.searchbanner);

adminRoute.get('/admin_logout',adminAuth.islogout,adminControl.adminLogout);
module.exports= adminRoute;