const mongoose=require('mongoose')
const ObjectId =mongoose.Types.ObjectId;
const bookSchema =new mongoose.Schema({
    title: {type:String, required:true, unique:true},
    excerpt: {type:String, required:true},

    userId: {typr:ObjectId,ref:'User', required:true},
    ISBN: {type:String,required:true, unique:true},
    category: {type:String,required:true},
    subcategory: [{type:String, required:true}],
    reviews: {type:Number, default: 0},
    deletedAt: {Date, }, 
    isDeleted: {type:Boolean, default: false},
    releasedAt: {Date, required:true, moment().format("YYYY-MM-DD")},
    
  },{tipmestamps:true})