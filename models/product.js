const mongoose=require("mongoose");
const { array } = require("../routes/upload");

const Schema=mongoose.Schema
const productschema=new Schema({

    name:{
        type:String,
        required:true
    },
    discription:{
        type:String,
       
      
    },
    price:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
        
    },
    subcategory:{
        type:String,
        required:true
        
    },
    image1:{
        type:String,
        
    },
    image2:{
        type:String,
        
    },
    stock:{
        type:Number,
        required:true
    }
});

const product=mongoose.model('products',productschema)

module.exports=product;
