const mongoose=require('mongoose');
const { array } = require('../routes/upload');
const schema=mongoose.Schema

const orderschema= new schema({
    userid:{
        type:String,
        required:true

    },
    amount:{
        type:String,
        required:true
    },
    Date:{
        type:String,
        required:true
    },
    status:{
        type:String
    },
    products:[{
        
       
    }],
    currentmonth:{
        type:String,
        required:true
    },
    payment:{
             type:String,

    },
   
    orderconfirmed:{
        type:Boolean,
        require:true
    },
    address:{
        type:String
    },
        
    
    delivered:{
        type:Boolean,
        required:true
    },
    
})

const order=mongoose.model('orders',orderschema)

module.exports=order;