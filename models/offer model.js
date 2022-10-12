const mongoose=require('mongoose')
const Schema=mongoose.Schema

const offerschema= new Schema({
    

    discount:{
        type:String
    },
    offername:{
        type:String
    },
    discription:{
        type:String
    },
    productid:{
        type:String
    },
    productname:{
        type:String
    }
})

const offer=mongoose.model('offers',offerschema)
module.exports=offer