
const mongoose= require('mongoose')
const Schema=mongoose.Schema



const wishlistschema= new Schema({

    userid:{
        type:String,
        required:true
        
    },
    productname:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    image:{ 
        type:String,
        required:true
    },
    productid:{
        type:String,
        required:true
    }
});

const wishlist=mongoose.model('wishlists',wishlistschema)

module.exports=wishlist;