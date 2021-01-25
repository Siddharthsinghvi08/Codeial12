const nodeMailer = require('../config/nodemailer');

exports.newPost = (post) =>{
    let htmlString=nodeMailer.renderTemplate({post:post},'Posts/new_post.ejs');
    nodeMailer.tranporter.sendMail({
        from:'testwalter112@gmail.com',
        to:post.user.email,
        subject:'new post created',
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
