const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res){
    // console.log(req.cookies);
    // res.cookie('user_id', 25);
     try{

            // bro if this is taking time , shall i take other doubt ?? will come back to you in  a while ?
            // just a sec more
    // populate the user of each post
    // sort used for sorting post according to there creation
     // CHANGE :: populate the likes of each post and comment
     let posts = await Post.find({})
     .sort('-createdAt')
     .populate('user')
     .populate({
         path: 'comments',
         populate: {
             path: 'user'
         },
         populate:{
             path: 'likes'
         }
     }).populate('likes');

     
     let users= await User.find({});
     console.log('posts:',posts);
     return res.render('home', {
            title: "Codeial | Home",
            posts:  posts,
            all_users: users
        });
     }catch(err){
      console.log("ERROR")

     }
       

        
}
