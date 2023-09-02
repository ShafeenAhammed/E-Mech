const admincollection = require("../../Model/adminDetails");
const productCollection = require("../../Model/productDetails");
const orderCollection = require("../../Model/orderDetails");
const usercollection = require("../../Model/userDetails");
const categoryCollection = require("../../Model/categoryDetails");

module.exports = {
    //load admin signin
    loadAdminSignin: async (req, res) => {
        res.render('adminLogin');
    },
    // load admin homepage
    loadAdminHomePage: async (req, res) => {
        try {
            const users = await usercollection.find().count();
            const orders = await orderCollection.find();
            const ordercount = await orderCollection.find().count();
            const productcount = await productCollection.find().count();
            let totalRevenue = 0;
            for (let i = 0; i < orders.length; i++) {
                if (orders[i].order_status === "Delivered") {
                    totalRevenue += orders[i].total_amount;

                }
            }
            res.render("adminHomePage", { users, orders, ordercount, productcount, totalRevenue });
        }
        catch (err) {
            console.log(err);
        }
    },
    // data for chart
    getChartData: async (req, res) => {
        try {
            const orders = await orderCollection.find();
            const category = await categoryCollection.find();
            const products = await productCollection.find();
            const totalDelivery = orders.filter(data => data.order_status === "Delivered").length;
            const totalCancelled = orders.filter(data => data.order_status === "Cancelled").length;
            const totalReturn = orders.filter(data => data.order_status === "Returned").length;
            const COD = orders.filter(data => data.payment_method === "COD").length;
            const online = orders.filter(data => data.payment_method === "onlinePayment").length;
            const wallet = orders.filter(data => data.payment_method === "walletPayment").length;
            const categoryNames = category.map(Items => Items.category_name);
            let counts = [];
            for (const item of categoryNames) {
                let c = products.filter(product => product.product_category === item).length;
                counts.push(c);
            }
            const chartData = {
                labels: ["Delivered", "Cancelled", "Returned"],
                orderCounts: [totalDelivery, totalCancelled, totalReturn],
                methodLabels: ["COD", "onlinePayment", "walletPayment"],
                methodCounts: [COD, online, wallet],
                categoryLabels: categoryNames,
                categoryCounts: counts
            };
            res.json(chartData)
        }
        catch (err) {
            console.log("error in chart data", err);
        }
    },
    // admin signin
    adminSignIn: async (req, res) => {
        try {
            const check = await admincollection.findOne({ admin_name: req.body.admin_name })
            if (check.admin_password === req.body.admin_password) {
                res.status(200).redirect(`/adminotp_verification?admin=${check.admin_name}`)
            } else {
                res.status(500).render('adminLogin', { msg: "Invalid Password!" });
            }
        }
        catch (err) {
            res.status(500).send("Wrong username")
        }
    },
    // dashboard
    adminLogout: async (req, res) => {
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
                res.send("Error");
            } else {
                res.render('adminLogin', { logout: "Logged out successfully" });
            }
        })
    }
}