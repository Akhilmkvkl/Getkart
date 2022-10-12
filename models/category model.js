const mongoose=require('mongoose')
const schema=mongoose.Schema

const categoryschema=new schema({
    
    category:{
        type:String,
        required:true
    }
})

const category=mongoose.model('categories',categoryschema)
module.exports=category;