const admincollection = require("../Model/adminDetails");
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const client = require('twilio')(accountSid,authToken);

module.exports={
    islogin : async (req,res,next)=>{
        if(req.session.admin){
            res.redirect('/admin_panel');
        }   
        else{
            next();
        }  
    },
    islogout : async (req,res,next)=>{
        if(req.session.admin){
            next()
        }
        else{
            res.redirect('/admin_login');
        }      
    },
    adminotpGenerate: async(req,res,next)=>{
        let otp= '';
        for (var i = 0; i < 4; i++) {
            otp += Math.floor(Math.random() * 10);
        }
        req.session.otp=otp;
        req.session.data = req.query.admin;
        console.log("this is",req.session.otp);
        client.messages.create({
            body: `<#> ${otp} is your E-Mech verification code.`,
            to: '+919074916473', // Text your number
            from: '+12892076517', // From a valid Twilio number
        })
        .then((message) => console.log(message))
        .catch(err => console.log(err));
        res.render('adminOtp');
        next();
    },

    adminotpVerification: async (req, res, next) => {
        try {
            if (req.session.otp === req.body.otp) {
                req.session.admin=req.session.data;
                
                res.status(200).redirect('/admin_panel');
                console.log("otp crct");
            }else{
                console.log("otp not crct");
            }
        }
        catch(err){
            console.log(err);
        }
    }
    
}