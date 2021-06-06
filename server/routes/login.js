const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Trainer = require('../models/trainer');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');


/* =========================================== SIGN UP/ CREATE TRAINER  ================================================ */

router.post('/api/addTrainer', (req,res)=>{

    const {username,password} = req.body;

    const userId = uuidv4();

    User.findOne({username:username}, async(err,doc)=>{

        const loginResponse = {
            loggedIn:false, 
            error:null, 
            userId:userId, 
            username, 
            profile:"trainer"
        };

        if (err) {
            loginResponse.error = err;
            throw err;
        }

        if (doc) {
            loginResponse.error = "Username already exists";
            res.send(loginResponse);
        }

        if(!doc){
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                userId:userId,
                username,
                password:hashedPassword,
                profile:"trainer"
            });

            const trainer = new Trainer({
                userId:userId,
                contact:{
                    username,
                    password:"",
                    fname: "First Name",
                    lname: "Last Name",
                    email: "Email",
                    phone:"Phone Number",
                    address:"Street Address",
                    city:"City",
                    province:"Province",
                    country:"Country",
                    postal:"Postal"
                },
                company:{
                    name:"Add Company Name",
                    description:"Add Company Description",
                    logo:""
                },
                social:{
                    facebook:"",
                    twitter:"",
                    instagram:"",
                    linkedIn:""
                }
            });

            await newUser.save();
            await trainer.save();
            loginResponse.loggedIn = true;
            res.send(loginResponse);
        }
    })
    
});

/* =========================================== LOG IN - GET USER DETAILS ================================================ */

router.post("/api/login", (req,res, next)=>{

    const loginResponse = {
        loggedIn:false, 
        error:null, 
        userId:null, 
        username:null,
        email:null, 
        profile:req.params.profile
    };

    passport.authenticate('local', (err,user,info) =>{
        if (err){
            loginResponse.error = err;
            throw err;
        }
        if (!user){
            loginResponse.error = info.message; //contains error log in message
            res.send(loginResponse);
        }
        else{
            req.logIn(user, err =>{
                if (err) throw err;
                loginResponse.loggedIn = true;
                loginResponse.userId = req.user.userId;
                loginResponse.username = req.user.username;
                loginResponse.profile = req.user.profile;
                res.send(loginResponse);
            })
        }
    })(req, res, next);
})

/* =========================================== LOG OUT ================================================ */

router.get("/api/logout", (req,res)=>{
    req.logout();
    res.send("Logged Out");
});


/* =========================================== GOOGLE LOGIN ================================================ */
router.get('/auth/google',passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', (req,res, next)=>{

    passport.authenticate('google', async (err,user,info) =>{
        const userId = uuidv4();

        if (err){
            res.send(err);
            console.log(err);
        }
        if (!user){
            const newUser = new User({
                userId:userId,
                googleId:info.profile.id,
                username:"google",
                password:"google",
                profile:"trainer"
            });

            const trainer = new Trainer({
                userId:userId,
                contact:{
                    username:"google",
                    password:"google",
                    fname: info.profile._json.given_name,
                    lname: info.profile._json.family_name,
                    email: info.profile._json.email,
                    phone:"Phone Number",
                    address:"Street Address",
                    city:"City",
                    province:"Province",
                    country:"Country",
                    postal:"Postal"
                },
                company:{
                    name:"Add Company Name",
                    description:"Add Company Description",
                    logo:""
                },
                social:{
                    facebook:"",
                    twitter:"",
                    instagram:"",
                    linkedIn:""
                }
            });
            await newUser.save();
            await trainer.save();

            if (process.env.NODE_ENV === "production"){
                res.redirect(`https://plan2train.herokuapp.com/trainer/${userId}`);
            }else{
                res.redirect(`http://localhost:3000/trainer/${userId}`);
            }
        }
        else{
            req.logIn(user, err =>{
                if (err) console.log(err);

                if (process.env.NODE_ENV === "production"){
                    res.redirect(`https://plan2train.herokuapp.com/trainer/${user.userId}`);
                }else{
                    res.redirect(`http://localhost:3000/trainer/${user.userId}`);
                }
            })
        }
    })(req, res, next)
});

//login using facebook
router.get('/auth/facebook',passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback', (req,res, next)=>{

    passport.authenticate('facebook', async (err,user,info) =>{
        const userId = uuidv4();

        if (err){
            res.send(err);
            console.log(err);
        }
        if (!user){
            const newUser = new User({
                userId:userId,
                facebookId:info.profile.id,
                username:"facebook",
                password:"facebook",
                profile:"trainer"
            });

            const trainer = new Trainer({
                userId:userId,
                contact:{
                    username:"facebook",
                    password:"facebook",
                    fname: info.profile._json.first_name,
                    lname: info.profile._json.last_name,
                    email: info.profile._json.email,
                    phone:"Phone Number",
                    address:"Street Address",
                    city:"City",
                    province:"Province",
                    country:"Country",
                    postal:"Postal"
                },
                company:{
                    name:"Add Company Name",
                    description:"Add Company Description",
                    logo:""
                },
                social:{
                    facebook:"",
                    twitter:"",
                    instagram:"",
                    linkedIn:""
                }
            });
            await newUser.save();
            await trainer.save();

            console.log(info.profile._json);

            if (process.env.NODE_ENV === "production"){
                res.redirect(`https://plan2train.herokuapp.com/trainer/${userId}`);
            }else{
                res.redirect(`http://localhost:3000/trainer/${userId}`);
            }
        }
        else{
            req.logIn(user, err =>{
                if (err) console.log(err);

                if (process.env.NODE_ENV === "production"){
                    res.redirect(`https://plan2train.herokuapp.com/trainer/${user.userId}`);
                }else{
                    res.redirect(`http://localhost:3000/trainer/${user.userId}`);
                }
            })
        }
    })(req, res, next)
});


module.exports = router;