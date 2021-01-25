const nodemailer = require('nodemailer');
const env=require('./environment')
const ejs = require('ejs');
const path = require('path');


const tranporter= nodemailer.createTransport(env.smtp);


let renderTemplate = (data, relativePath) =>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){
                console.log("ERROR in rendering template",err);
                return;
            }
            mailHTML=template;
        }
    )
return mailHTML;
}



module.exports={
    tranporter:tranporter,
    renderTemplate: renderTemplate
}
