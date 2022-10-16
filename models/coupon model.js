const mongoose=require('mongoose')
const schema=mongoose.Schema

const couponschema= new schema({

    couponid:{
        type:String,
        required:true
    },
    couponvalue:{
        type:String,
        required:true
    },
    minamount:{
        type:String,
    },
    maxamount:{
        type:String
    },
    fromdate:{
        type:Date
    },
    uptodate:{
        type:Date
    },
    usedcustomers:[
        {
            userid:{type:String}
        }
    ]

})

const coupon=mongoose.model('coupons',couponschema);
module.exports=coupon;