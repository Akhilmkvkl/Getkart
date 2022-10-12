const mongoose = require('mongoose')
 const Schema=mongoose.Schema

 const addressschema=new Schema({

    userid:{
        type:String,
        required:true
    },

    pincode:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    streetname:{
        type:String,
        required:true
    },
    
 });

 const address = mongoose.model('addresses',addressschema)

 module.exports=address;