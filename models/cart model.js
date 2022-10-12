const mongoose=require('mongoose')
const schema=mongoose.Schema

const cartschema =new schema({
     
   
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
    quantity:{
         type:Number,
         required:true
    },
   
    
    productid:{
        type:String,
        required:true
    }
})
  const cart=mongoose.model('carts',cartschema)

  module.exports=cart;