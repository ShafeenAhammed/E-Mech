const express= require("express");
const userRoute= express();
const session= require("express-session");

const userControl= require("../Controller/userController/userControl");
const userCategoryControl= require("../Controller/userController/userCategoryControl");
const userProductControl= require("../Controller/userController/userProductControl");
const userAuth = require("../Middleware/userAuth");
const {v4:uuidv4}= require("uuid");
const userCartControl = require("../Controller/userController/userCartControl");
const userWishlistControl = require("../Controller/userController/userWishlistControl");
const userProfileControl = require("../Controller/userController/userProfileControl");
const userPaymentControl = require("../Controller/userController/userPaymentControl");
const userOrderControl = require("../Controller/userController/userOrderControl");
const userWalletControl = require("../Controller/userController/userWalletControl");

userRoute.use(session({
    secret:uuidv4(),
    resave:false,
    saveUninitialized:true
}));
userRoute.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

userRoute.set('view engine', 'ejs')
userRoute.set('views', './views/user')

userRoute.get('/',userControl.loadNotSignedInLandingPage);

userRoute.get('/user_registration',userControl.loadUserSignUp);

userRoute.post('/user_registration',userControl.userSignUp);

userRoute.get('/otp_verification',userAuth.otpGenerate);
userRoute.post('/otp_verification',userAuth.otpVerification);

userRoute.get('/user_homepage',userAuth.islogout,userControl.userhomepage);
userRoute.get('/user_signin',userAuth.islogin,userControl.loadUserSignin);
userRoute.post('/user_signin',userAuth.blocked,userControl.userSignIn);
userRoute.get('/forgot_password',userControl.forgotPassLoad);
userRoute.post('/forgot_password',userControl.forgotPass);
userRoute.get('/passwordotp_verification',userAuth.passotpGenerate);
userRoute.post('/passwordotp_verification',userControl.passotpVerification)
userRoute.get('/password_reset',userControl.PassResetLoad);
userRoute.post('/password_reset',userControl.verifyPassReset);

userRoute.get('/search',userAuth.islogout,userProductControl.search);
userRoute.get('/product_page',userProductControl.loadproductPage);
userRoute.get('/all_products',userAuth.islogout,userProductControl.loadAllproducts);
userRoute.get('/filtered_products',userAuth.islogout,userProductControl.loadFilteredProducts);

userRoute.get('/category_page',userAuth.islogout,userCategoryControl.loadcategoryPage);

userRoute.get('/wishlist',userAuth.islogout,userWishlistControl.loadWishList);
userRoute.get('/addtowishlist',userAuth.islogout,userWishlistControl.addToWishList);
userRoute.get('/delete_wishlist',userAuth.islogout,userWishlistControl.deleteWishList);

userRoute.get('/cart',userAuth.islogout,userCartControl.loadCart);
userRoute.get('/addtocart',userAuth.islogout,userCartControl.addToCart);
userRoute.get('/incrementquantity',userAuth.islogout,userCartControl.incrementQuantity);
userRoute.get('/decrementquantity',userAuth.islogout,userCartControl.decrementQuantity);
userRoute.get('/delete_cart',userAuth.islogout,userCartControl.deleteCart);

userRoute.get('/checkout',userAuth.islogout,userPaymentControl.loadCheckoutPage);
userRoute.post('/applycoupon',userAuth.islogout,userPaymentControl.applyCoupon);
userRoute.get('/removecoupon',userAuth.islogout,userPaymentControl.removeCoupon);
userRoute.post('/checkout',userAuth.islogout,userPaymentControl.payment);
userRoute.post('/verify-payment', userAuth.islogout,userPaymentControl.verifyPayment);

userRoute.get('/orders',userAuth.islogout,userOrderControl.loadOrderPage);
userRoute.get('/ordersdetails',userAuth.islogout,userOrderControl.loadOrderDetails);
userRoute.get('/invoice',userAuth.islogout,userOrderControl.loadInvoice);
userRoute.get('/invoicepdf',userAuth.islogout,userOrderControl.invoicePDF);
userRoute.get('/cancelorder',userAuth.islogout,userOrderControl.cancelOrder);
userRoute.get('/returnorder',userAuth.islogout,userOrderControl.loadReturnPage);
userRoute.post('/returnorder',userAuth.islogout,userOrderControl.returnOrder);


userRoute.get('/userprofile',userAuth.islogout,userProfileControl.loadUserProfile);
userRoute.get('/useraddressmanagement',userAuth.islogout,userProfileControl.loadAddressManagement);
userRoute.get('/addaddress',userAuth.islogout,userProfileControl.loadAddAddress);
userRoute.post('/addaddress',userAuth.islogout,userProfileControl.addAddress);
userRoute.get('/editaddress',userAuth.islogout,userProfileControl.loadEditAddress);
userRoute.post('/editaddress',userAuth.islogout,userProfileControl.editAddress);
userRoute.get('/deleteaddress',userAuth.islogout,userProfileControl.deleteAddress);
userRoute.get('/orderhistory',userAuth.islogout,userProfileControl.loadOrderHistory);

userRoute.get('/wallet',userAuth.islogout,userWalletControl.loadWallet);
userRoute.post('/topup',userAuth.islogout,userWalletControl.topUpWallet);
userRoute.post('/verify-topup', userAuth.islogout,userWalletControl.verifyTopUp);
userRoute.get('/wallet_history',userAuth.islogout,userWalletControl.loadWalletHistory);

userRoute.get('/user_logout',userAuth.islogout,userControl.userLogout);

module.exports=userRoute;