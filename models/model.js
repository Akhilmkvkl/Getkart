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



// const adminSchema=new mongoose.Schema({
//     email:String,
//     password:String
// })


// const admin=mongoose.model('admins',adminSchema)
const users=mongoose.model('users',userSchema);


const Admin = mongoose.model('Admin', {
    email: { type: String, required: true},
    password: { type: String, required: true }
});

const new_admin = new Admin({
    email: 'adminakhil@gmail.com',
    password: '123'
}) 

new_admin.save()

module.exports={users,Admin};