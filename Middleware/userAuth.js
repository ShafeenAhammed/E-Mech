
const usercollection = require('../Model/userDetails');
const express = require("express");
require("dotenv").config();
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const client = require('twilio')(accountSid,authToken);
module.exports={
    islogin : async (req,res,next)=>{
        if(req.session.user){
            res.redirect('/user_homepage');
        }
            
        else{
            next();
        }
           
    },
    islogout : async (req,res,next)=>{
        if(req.session.user)
            next()
        else
            res.redirect('/user_signin');
    },
    blocked: async (req,res,next)=>{
        const check= await usercollection.findOne({username:req.body.username})
        if(check.isBlocked){
            return res.status(500).send("User is Blocked");
        }else{
            next();
        }
    },

    otpGenerate: async(req,res,next)=>{
        let otp= '';
        for (let i = 0; i < 4; i++) {
            otp += Math.floor(Math.random() * 10);
        }
        req.session.otp=otp;
        console.log("this is",req.session.otp);
        client.messages.create({
            body: `<#> ${otp} is your E-Mech verification code.`,
            to: '+919074916473', // Text your number
            from: '+12892076517', // From a valid Twilio number
        })
        .then((message) => console.log(message))
        .catch(err => console.log(err));
        res.render('otp');
        // next();
    },
    passotpGenerate: async(req,res,next)=>{
        let otp= '';
        for (let i = 0; i < 4; i++) {
            otp += Math.floor(Math.random() * 10);
        }
        req.session.otp=otp;
        console.log("this is",req.session.otp);
        client.messages.create({
            body: `<#> ${otp} is your E-Mech verification code.`,
            to: '+919074916473', // Text your number
            from: '+12892076517', // From a valid Twilio number
        })
        .then((message) => console.log(message))
        .catch(err => console.log(err));
        res.render('passOTP');
        // next();
    },

    otpVerification: async (req, res, next) => {
        try {
            if (req.session.otp === req.body.otp) {
                await usercollection.updateOne({username: req.session.username},{$set:{isVerified:true}});
                res.status(200).redirect("/user_homepage");
                console.log("otp crct");
            }else{
                res.render('otp',{msg:"Incorrect OTP"})
            }
        }
        catch(err){
            console.log(err);
        }
    }
}
 
