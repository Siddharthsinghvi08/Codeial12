const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User= require('../models/user')
// Authentication using passport
passport.use(new LocalStrategy({
   usernameField:'email',
   passReqToCallback:true
},
   function(req,email,password,done){
      User.findOne({email:email},function(err,user){
    if(err){
        req.flash('error',err)
        return done(err);
    }
    if(!user || user.password!=password){
       req.flash('error','Invalid username/Password');
        return done(null,false);
    }

    return done(null,user);
      });
   }

));

// Serializing the user tp decide which is to kept in the cookies
passport.serializeUser(function(user,done){
done(null,user.id);
});



// deserializing the user from the key in the cookies
passport.deserializeUser(function(id,done){
User.findById(id,function(err,user){
  if(err){
    console.log('Error finding in user ==> passport');
    return done(err);
  }
  done(null,user);
})
});


passport.checkAuthentication = function(req,res,next){
// if user is authenticated
if(req.isAuthenticated()){
  return next();
}
return res.redirect('/users/sign-in');

}

passport.setAuthenticatedUser =function(req,res,next){
  if(req.isAuthenticated()){
    // req user contains the current signed in user from the session cookies and send  it to views
    res.locals.user=req.user;
  }
  next();
}


module.exports=passport;