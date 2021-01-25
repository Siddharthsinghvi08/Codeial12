const nodeMailer = require('../config/nodemailer');


exports.newComment = (comment) =>{
  let htmlString=nodeMailer.renderTemplate({comment: comment}, 'Comments/new_comment.ejs')

    nodeMailer.tranporter.sendMail({
        from:'testwalter112@gmail.com',
        to:comment.user.email,
        subject:'new commment Published',
        html:htmlString
    },(err,info)=>{
       if(err){
           console.log('error in sending mail',err);
           return;
       }

console.log('messge sent',info);
return;

    });
}