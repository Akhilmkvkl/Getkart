
const cart = require("../models/cart model");

const { ObjectId } = require("mongodb");


module.exports={

    CartProdQtyChange:(userId, prodId, qty)=>{
        console.log(userId)
        console.log(prodId)
        console.log(qty)
       let  Qty = parseInt(qty)
       console.log(Qty)
 
        return new Promise(async (resolve, reject)=>{

            let abc = cart.updateOne({userid:userId, productid:prodId },{$inc:{quantity:Qty}}).then((response)=>{
                response.change = true
                resolve(response)
                console.log(abc)
            })
        })
    },
}