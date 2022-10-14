const express = require("express");
const router = express.Router();
const product = require("../models/product");
const cart = require("../models/cart model");
const session = require("express-session");
const { ObjectId } = require("mongodb");
const address = require("../models/address model");
const wishlist = require("../models/wishlistmodel");
const order = require("../models/ordermodel");
const { count } = require("../models/product");
const payhelper = require("../helpers/razorpay");
const { json, response } = require("express");
const { users } = require("../models/model");
const paypal = require("paypal-rest-sdk");

router.get("/product", (req, res) => {
  const id = req.query.id;
  product
    .findOne({ _id: id })
    .then((docs) => {
      console.log(docs);

      console.log(id);
      res.render("product-page", { docs, id });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/cart", (req, res) => {
  if (session.login && session.userid) {
    cart
      .find({ userid: ObjectId(session.userid) })
      .then((docs) => {
        let FinalAmount = 0;
        let totalAmount = 0;
        console.log(docs);
        for (let i = 0; i < docs.length; i++) {
          totalAmount = docs[i].price * docs[i].quantity;
          FinalAmount += totalAmount;
        }

        console.log(FinalAmount);
        const finalprice = FinalAmount + 50;
        console.log(finalprice);

        res.render("cart", { docs, FinalAmount, finalprice });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/login");
  }
});

//adding new address from user side at the time of checkout

router.post('/add-address',(req,res)=>{
  console.log(req.body)
  const addressdetails=new address({
    userid:ObjectId(session.userid),
    address:req.body.address,
    streetname:req.body.streetname,
    state:req.body.state,
    pincode:req.body.pincode
    
  })
  addressdetails.save()
  .then(()=>{
    res.redirect('/')
  })
})

//order  creation and it includes  the route to the razor pay

router.post("/placeorder", (req, res) => {
  console.log(req.body);

  cart
    .find({ userid: ObjectId(session.userid) }, { _id: 0 })
    .then((docs) => {
      console.log(docs);
      const orderdetails = new order({
        userid: ObjectId(session.userid),
        products: docs,
        orderconfirmed: false,
        delivered: false,
        Date: Date(),
        amount: session.price,
        status: "placed",
        payment: req.body.paymentMethod,
        address: req.body.selectedAddress
      });
      orderdetails.save().then(() => {
        //stock operation

        cart.find({ use: ObjectId(session.userid) }).then((products) => {
          console.log("here is the products", products);
          for (let i = 0; i < products.length; i++) {
            console.log(products[i].productid);
            product
              .updateMany(
                { _id: ObjectId(products[i].productid) },
                { $inc: { stock: -products[i].quantity } }
              )

              .catch((err) => {
                console.log(err);
              });

            console.log(products[i].quantity);
          }
        });

        //for cart clearance

        console.log("ordeer created successfully");
        cart.deleteMany({ userid: ObjectId(session.userid) }).then(() => {
          console.log("cart cleared due to oders success");
        });
      });

      if (req.body["paymentMethod"] === "cod") {
        res.json({ codSuccess: true });
      } else if (req.body["paymentMethod"] === "razorpay") {
        console.log("generating rasorpay");
        const totalAmount = session.price;
        payhelper.generateRazorpay(totalAmount).then((order) => {
          console.log(order);
          res.json({ order, razorpay: true });
        });
      } else if (req.body["paymentMethod"] === "paypal") {
        const totalAmount = session.price;
        console.log("working on generating the paypaal");
        const orderid = 123456;
        console.log(totalAmount);
        res.json({ totalAmount, paypal: true, orderid });
      }
    })

    .catch((err) => {
      console.log(err);
      res.redirect("/adminhome/cart");
    });
});

router.post("/razo-verify-payment", (req, res) => {
  console.log(req.body);
  payhelper
    .verifyPayment(req.body)
    .then(() => {
      currectStatus = "placed";

      userHealpers
        .changePaymentStatus(req.body["order[receipt]"], currectStatus)
        .then(() => {
          console.log("payment success");
          res.json({ status: true });
        });
    })
    .catch((err) => {
      console.log(err);
      currectStatus = "Payment Not Compleeted";

      userHealpers
        .changePaymentStatus(req.body["order[receipt]"], currectStatus)
        .then(() => {
          console.log("paymement not compeeeet");
          res.json({ status: false });
        });
    });
});

//paypal payment
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AZ2AayrlvjY49wwDaGRX7ysaDOMQYZxjPhRlQUE0rV4H20gQPf7ShU-00oxF2evc5lE_Db4zHOyheHLp",
  client_secret:
    "EIXsHs3ovEsthYpdeZwX7qaK7fYUb0401pUKwyhqLaxL8-p09vO8s1QcyerqvPoosTxEtZiBm3IQsqRV",
});

router.post("/paypal-payment", (req, res) => {
  console.log(req.body);

  let totalPrice = req.body.totalPrice;
  req.session.totalPrice = totalPrice;
  console.log(totalPrice);
  // let orderId =  req.body.orderId  (it will  be fixed soon!!)
  let orderId = 1234567;
  req.session.orderId = orderId;
  console.log("the paypal is started to working");
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:4000/usehome/paypal-payment/success",
      cancel_url: "http://localhost:4000/userhome/paypal-payment/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Red Sox Hat",
              sku: "001",
              price: "" + totalPrice,
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: "" + totalPrice,
        },
        description: "Hat for the best team ever",
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      console.log("Create Payment resoponse");

      payment.orderId = orderId;
      console.log(payment);

      {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.json({ forwardLink: payment.links[i].href });
          }
        }
      }
    }
  });
});

router.get("/paypal-payment/success", (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const totalPrice = req.session.totalPrice;
  const orderId = req.session.user.orderId;
  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: "" + totalPrice,
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log("this pay ment final");
        currectStatus = "placed";
        userHealpers.changePaymentStatus(orderId, currectStatus).then(() => {
          console.log("payment success");
          res.render("users/orderSuccess");
        });
      }
    }
  );
});

router.get("/paypal-payment/cancel", (req, res) => {
  // need to replace with the currect payment cancelled notification
  res.send("payment cancelled");
  const orderId = req.session.user.orderId;
  currectStatus = "Payment Not Compleeted";

  payhelper.changePaymentStatus(orderId, currectStatus).then(() => {
    console.log("paymement not compeeeet");
    res.json({ status: false });
  });
});

//end of paypal payment and its need to verify

router.get("/wishlist", (req, res) => {
  wishlist
    .find({ userid: ObjectId(session.userid) })
    .then((docs) => {
      if (docs) {
        res.render("wishlist", { docs });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/addtowish", (req, res) => {
  const id = req.query.id;
  console.log(id);
  if (session.login && session.userid) {
    product
      .findOne({ _id: id }, { name: 1, price: 1, image1: 1, _id: 1 })
      .then((docs) => {
        const wishdetails = new wishlist({
          userid: ObjectId(session.userid),
          productname: docs.name,
          price: docs.price,
          image: docs.image1,
          productid: docs._id,
        });
        wishdetails
          .save()
          .then(() => {
            console.log("prodcut added to the wishlist");
            res.redirect("/shop");
          })
          .catch((err) => {
            console.log(err);
          });
      });
  } else {
    res.redirect("/login");
  }
});

router.get("/removewish", (req, res) => {
  const id = req.query.id;
  wishlist.deleteOne({ productid: id }).then(() => {
    res.redirect("/userhome/wishlist");
  });
});

// order management !!

router.get("/order", (req, res) => {
  if (session.login || session.userid) {
    order.find({ userid: ObjectId(session.userid) }).then((docs) => {
      if (docs) {
        console.log(docs);
        const orderid = ObjectId(docs._id);
        console.log(orderid);
        res.render("order-overview", { docs });
      }
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/myorders", (req, res) => {
  if (session.login || session.userid) {
    const orderid = req.query.id;
    console.log("this" + orderid);
    order
      .findOne({ userid: ObjectId(session.userid), _id: orderid })
      .then((docs) => {
        if (docs) {
          console.log(docs);
          const document = docs.products;
          res.render("myorders", { document, docs });
        } else {
          res.render("myorders", { document: "", docs: "" });
        }
      })
      .catch(() => {
        res.render("myorders");
      });
  } else {
    res.redirect("/login");
  }
});

//order cancellation it is stock related if the user cancelled it the quantity will be readded to the stock

router.get("/cancellorder", (req, res) => {
  console.log(req.query.id);
  const id = req.query.id;

  order.findOne({_id:ObjectId(id),userid:ObjectId(session.userid)},{_id:0,products:1})
  .then((products)=>{
    
    console.log(products)
    const item = products.products
    console.log('what is this ');
    console.log(item)
    for(let i=0;i<item.length;i++){
      product.updateMany({_id:ObjectId(item[i].productid)},{$inc:{stock:item[i].quantity}})
      .catch((err)=>{
        console.log(err);
      })
    }
    

  })


  order
    .deleteOne({ userid: ObjectId(session.userid), _id: ObjectId(id) })
    .then(() => {
      console.log("order cancelled successfully");
      res.redirect("/userhome/order");



    });
});
router.get("/success", (req, res) => {
  res.render("ordersuccess");
});

router.get("/profile", (req, res) => {
  if (session.login) {
    users.findOne({ _id: ObjectId(session.userid) }).then((docs) => {
      address
        .findOne({ userid: ObjectId(session.userid) })
        .then((addresses) => {
          res.render("profile", { docs, addresses });
        });
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
