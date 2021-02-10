const User = require('./models/user')
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// var GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = function(passport){

    //username: req.body.username
    //password: req.body.password
    //done: callback function that says we are done with this step lets move on to the next step
    //defining the local strategy
    passport.use(
        new localStrategy((username, password, done) =>{

            User.findOne({username:username}, (err, user) =>{
                if (err) return done(err);
                if(!user) return done(null, false, {message:"Username not Found"}); //null is the error and false is the user
                bcrypt.compare(password, user.password, (err,result)=>{
                    if (err) throw err;
                    if (result === true){
                        return done(null, user); //return null as the error and the user as the user
                    }
                    else{
                        return done(null, false, {message:"Incorrect Password"}) //comparison failed
                    }
                })
            })
            
        })
    );

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/google/callback"
      },
      
      function(token, tokenSecret, profile, done) {

        User.findOne({googleId:profile.id}, (err, user) =>{
            if (err) return done(err,false, {message:err});
            if (!user){
                // console.log(profile.id)
                return done(null, false, {profile}); //null is the error and false is the user
            }
            if (user) return done(null, user); //return null as the error and the user as the user
        });
      }
    ));



    //passport requires a serialized user and a deserialized user

    //stores a cookie inside of the browser, take the user we got from our local strategy and create a cookie with a user id inside of it
    passport.serializeUser((user, cb)=>{
        cb(null, user.id);
    })

    //takes a cookie, unravels it and returns a user from it

    passport.deserializeUser((id,cb)=>{
        User.findOne({_id:id}, (err,user)=>{
            const userInformation = {
                username:user.username
            };
            cb(err,userInformation); //can restrict what data you want to be returned
        })
    })


}