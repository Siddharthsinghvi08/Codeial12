const express = require('express');
const env = require('./config/environment');
const logger= require('morgan');
const cookieParser =require('cookie-parser'); 
const app = express();
require('./config/view-helpers')(app);
const port=8000;
const expressLayout = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session =require('express-session');
const passport = require('passport');
const passportLocal=require('./config/passport-local-strategy');
const passportJwt = require('./config/passport-jwt-strategy');
const passportGoogle= require('./config/passport-google-oauth2-strategy');
const { Store } = require('express-session');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware=require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
// setup chat server to be used in socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log("Chat server listening on 5000");
const path= require('path');
if(env.name== 'development'){
    app.use(sassMiddleware({
        src:path.join(__dirname,env.asset_path,'/scss'),
        dest:path.join(__dirname,env.asset_path,'/css'),
        debug:true,
        outputStyle:'extended',
        prefix:'/css'
        }));
}

app.use(express.urlencoded({extended: false}));
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(env.asset_path));

app.use(logger(env.morgan.mode,env.morgan.options));

app.use(expressLayout);
// extract styles and scripts
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


// make the upload path available to the browser 
app.use('/uploads',express.static(__dirname + '/uploads'));
// setup a view engine
app.set('view engine','ejs');
app.set('views','./views');
// mongo store is used to store the session cookie in the databse
app.use(session({
    name:'codeial',
    // TODO change secret before deployment
    secret:env.session_cookie_key,
    saveUninitialized:'false',
    resave:'false',
    cookie:{
        age:(1000 * 60 * 100),
    },
    store :new MongoStore({
        mongooseConnection:db,
        autoremove:'disabled'
    },
    function(err){
        console.log(err || "connected to mongodb");
    }
    )
}));

// initialize Passport js
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
// Flash Message
app.use(flash());
app.use(customMware.setFlash);
// use routes
app.use('/',require('./routes'));


app.listen(port,function(err){
if(err){
    console.log(`ERROR: ${err}`);
}
console.log(`server running on: ${port}`);

});
