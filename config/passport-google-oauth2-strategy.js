const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');

// tell passport to use new strategy for google login
passport.use(new googleStrategy({
    clientID:env.google_client_id,
    clientSecret:env.google_client_secret,
    callbackURL:env.google_callback_url,
},
// find the user if found set the user req.user
function(accessToken,refreshToken,profile,done){
    User.findOne({email:profile.emails[0].value}).exec(function(err,user){
        if(err){
            console.log("Error in google strategy",err);
            return;
        }
        console.log(profile);
        if(user){
            console.log(accessToken);
            //  if found set the user req.user
            return done(null,user);
        }else{
            // if not found then create the user and set the user as req.user
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex')
            },function(err,user){
                if(err){
                    console.log("Error in creating user google strategy",err);
                    return;}
                    return done(null,user);
            });
        }
    });
}

));


module.exports=passport;
