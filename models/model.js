const mongoose=require("mongoose")
const Schema=mongoose.Schema

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    confirm:{
        type:String,
    
    },
    block:{
        type:Boolean,
        
    }
},{timestamps:true});

const adminSchema=new mongoose.Schema({
    email:String,
    password:String
})


const admin=mongoose.model('admins',adminSchema)
const users=mongoose.model('users',userSchema);

module.exports={users,admin};