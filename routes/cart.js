const express = require("express");
const router = express.Router();
const { users, admin } = require("../models/model");
const product = require("../models/product");
const cart = require("../models/cart model");
const session = require("express-session");
const { ObjectId } = require("mongodb");
const productHandles=require('../helpers/prodqnty')
const address=require('../models/address model')

router.get("/", (req, res) => {
  const id = req.query.id;
  console.log(id);
 if(session.login && session.userid){
    
  users.findOne({ _id: ObjectId(session.userid) }, { _id: 1 }).then((docs) => {
    if (docs) {
      
      product
        .findOne({ _id: id }, { name: 1, price: 1, image1: 1, _id: 1 })
        .then((result) => {
          console.log(result);

          const cartdetails = new cart({
            userid: ObjectId(session.userid),
            productname: result.name,
            price: result.price,
            image: result.image1,
            productid: result._id,
            quantity:1,
            totalprice:0
            
          });
          cartdetails
            .save()
            .then(() => {
              console.log("Cart added succesfully");
             
              res.redirect("/shop");
            })
            .catch((err) => {
              console.log(err);
            });
        });
    }
  });
}else{
  res.redirect('/login')
} 
});

router.get("/remove", (req, res) => {
  const id = req.query.id;
  cart
    .deleteOne({ _id: id })
    .then(() => {
      
      res.redirect("/userhome/cart");
    })
    .catch((err) => {
      console.log(err);
      
      res.redirect("/shop");
    });






});

 router.get('/addcart',(req,res)=>{
  const id=req.query.id
  product
        .findOne({ _id: id }, { name: 1, price: 1, image1: 1, _id: 1 })
        .then((result) => {
          console.log(result);

          const cartdetails = new cart({
            userid: ObjectId(session.userid),
            productname: result.name,
            price: result.price,
            image: result.image1,
            productid: result._id,
            quantity:1,
            totalprice:0
            
          });
          cartdetails
            .save()
            .then(() => {
              console.log("Cart added succesfully");
             
              res.redirect("/shop");
            })
            .catch((err) => {
              console.log(err);
            });
        });
 }) 
  

router.get("/checkout", (req, res) => {
  cart.find().then((docs) => {
    console.log(docs);
    let price=req.query.id
    console.log(price)
    session.price=price
    address.find({userid:ObjectId(session.userid)})
    .then((addressdetails)=>{
      console.log(addressdetails)
      res.render("checkout", { docs,price,addressdetails});
    })
    .catch(()=>{
      res.render("checkout", { docs,price});
    })
    
  });
});

router.post('/changeQuantity', (req, res)=>{
  console.log('haiii')
  userId = req.body.user
  prodId = req.body.product
  qty = req.body.count
  console.log(req.body)

  


  productHandles.CartProdQtyChange(userId, prodId, qty).then((response)=>{
    res.send(response)
  })
})




module.exports = router;
