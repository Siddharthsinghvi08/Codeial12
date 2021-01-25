const Post = require('../models/post');
const Comment =require('../models/comment');
const postsMailer = require('../mailer/posts_mailer');
const Like = require('../models/like')

module.exports.create= async function(req,res){
try{
let post = await Post.create({
    content:req.body.content,
    user:req.user._id
 });
 post = await post.populate('user','name email').execPopulate();
 postsMailer.newPost(post);

if(req.xhr){
return res.status(200).json({
    data:{
        post:post
    },
    message:"Post Created!"
});
}


req.flash('success','Post Created');
return res.redirect('back');
}catch(err){
    req.flash('error','Error while creating a Post')
     return res.redirect('back');
}
}

module.exports.destroy= async function(req,res){
   
   try{
   let post= await Post.findById(req.params.id);
        // .id means converting the object id into string
       if(post.user == req.user.id){
 

          // CHANGE :: delete the associated likes for the post and all its comments' likes too
         await Like.deleteMany({likeable: post, onModel: 'Post'});
         await Like.deleteMany({_id: {$in: post.comments}});

         
              post.remove();
        await Comment.deleteMany({post:req.params.id});
        if(req.xhr){
            return res.status(200).json({
                data:{
                    post_id:req.params.id
                },
                message:"Post deleted!"
            });
            }

            req.flash('success','Post and associated Comments Deleted');
            return res.redirect('back');
        

       }else{
        req.flash('error','you cannot delete this Post');
           return res.redirect('back');
       }


    }catch(err){
        req.flash('error',err);
           return res.redirect('back');;
    }
}