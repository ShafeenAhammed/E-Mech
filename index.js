const express= require("express");
const path = require("path")
const userRoute= require('./Router/userRoute');
const adminRoute= require('./Router/adminRoute');
require("dotenv").config();
const app=express();
const PORT=process.env.PORT || 5000;

const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://ahammedshafeen10:maRbCqZjF1RNZqVf@cluster0.9bbvacv.mongodb.net/?retryWrites=true&w=majority").then(()=>console.log("MongoDB connected...")).catch((err)=>console.log("MongoDB failed to conenct",err));

app.set('view engine', 'ejs');

app.use('/static',express.static(path.join(__dirname,'assets')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/',userRoute);
app.use('/',adminRoute);

app.get('*', (req, res)=>{
    res.status(404).render('404')
})

app.listen(PORT,()=>console.log("Running 5000",PORT));
