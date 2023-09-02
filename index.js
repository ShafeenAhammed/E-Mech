const express= require("express");
const path = require("path")
const userRoute= require('./Router/userRoute');
const adminRoute= require('./Router/adminRoute');
require("dotenv").config();
const app=express();
const PORT=process.env.PORT || 5000;

const mongoose=require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/EMech").then(()=>console.log("MongoDB connected...")).catch(()=>console.log("MongoDB failed to conenct"));

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