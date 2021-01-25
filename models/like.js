const mongoose = require('mongoose');


const likeSchema = new mongoose.Schema({

user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
},
// This defines the obejct id for the liked object
likeable:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    refPath:'onModel'
},
// used to define the type of the liked object since this is dynamic reference
onModel:{
type:String,
required:true,
enum:['Post','Comment']
}



},{
    timestamps:true
})

const Like = mongoose.model('Like',likeSchema);
module.exports=Like;