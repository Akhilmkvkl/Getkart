const express = require("express");
const session = require("express-session");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { response } = require("../app");
const { users, admin } = require("../models/model");
const order = require("../models/ordermodel");
const product = require("../models/product");
const upload = require("./upload");
const { route } = require("./userhome");
const offer = require("../models/offer model");
const category=require('../models/category model')

router.get("/block", (req, res) => {
  const userId = req.query.id;
  users
    .updateOne({ _id: ObjectId(userId) }, { $set: { block: true } })
    .then((response) => {
      users
        .find((err, docs) => {
          const num = 1;
          if (!err) {
            session.login = true;
            res.redirect("/adminlogin");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
});

router.get("/unblock", (req, res) => {
  const userId = req.query.id;
  users
    .updateOne({ _id: ObjectId(userId) }, { $set: { block: false } })
    .then((response) => {
      users.find((err, docs) => {
        const num = 1;
        if (!err) {
          session.login = true;
          res.redirect("/adminlogin");
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/add-product", (req, res) => {
  session.login = true;
  category.find()
  .then((cat)=>{
    res.render("add-product", { docs: "",cat});
  })
  
});

router.post("/addproduct", upload.any(), (req, res) => {
  const products = new product({
    name: req.body.name,
    price: req.body.price,
    discription: req.body.discription,
    stock: req.body.stock,
    category: req.body.category,
    subcategory: req.body.subcategory,
    image1: req.files[0] && req.files[0].filename ? req.files[0].filename : "",
    image2: req.files[1] && req.files[1].filename ? req.files[1].filename : "",
  });

  products
    .save()
    .then(() => {
      console.log("Product added successfully");
      res.redirect("/adminhome/add-product");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/adminhome/add-product");
    });
});

router.get("/products", (req, res) => {
  product.find().then((docs) => {
    if (docs) {
      session.login = true;
      let num = 1;
      res.render("admin-products", { docs, num });
    }
  });
});

router.get("/delete", (req, res) => {
  const id = req.query.id;
  product.deleteOne({ _id: id }).then(() => {
    res.redirect("/adminhome/products");
  });
});

router.get("/update", (req, res) => {
  const id = req.query.id;
  product.findOne({ _id: id }).then((docs) => {
    if (docs) {
      category.find()
      .then((cat)=>{
        res.render("add-product", { docs,cat });
      })
      
    }
  });
});

router.get("/orders", (req, res) => {
  if (session.adminlogin) {
    order.find({ orderconfirmed: false, delivered: false }).then((docs) => {
      console.log(docs);
      res.render("adminorder", { docs });
    });
  } else {
    res.redirect("/adminlogin");
  }
});
router.get("/confirm", (req, res) => {
  const id = req.query.id;
  order.updateOne({ _id: id }, { $set: { orderconfirmed: true,status:"confirmed" } }).then(() => {
    res.redirect("/adminhome/orders");
  });
});
router.get("/confirmed", (req, res) => {
  order.find({ orderconfirmed: true, delivered: false , status:"confirmed" }).then((docs) => {
    res.render("adminorder", { docs });
  });
});
router.get("/delivered", (req, res) => {
  order.find({ orderconfirmed: true, delivered: true }).then((docs) => {
    res.render("adminorder", { docs });
  });
});
router.get("/deliver", (req, res) => {
  const id = req.query.id;
  order.updateOne({ _id: id }, { $set: { delivered: true,status:"delivered" } }).then(() => {
    res.redirect("/adminhome/confirmed");
  });
});

router.get("/vieworder", (req, res) => {
  const id = req.query.id;
  order.findOne({ _id: id }).then((docs) => {
    if (docs) {
      console.log(docs);
      users
        .findOne({ _id: docs.userid }, { name: 1, _id: 0 })
        .then((username) => {
          const userr = username.name;
          console.log(userr);
          order
            .findOne({ _id: id }, { products: 1, _id: 0 })
            .then((products) => {
              console.log(products.products);

              const items = products.products;
              res.render("vieworder", { docs, userr, items });
            });
        });
    }
  });
});

//offer management

router.get("/applyoffer", (req, res) => {
  res.render("addoffer");
});

router.post("/addoffer", (req, res) => {
  console.log(req.body);
  const offerdetails = new offer({});
});
//category adding
router.post('/add-category',(req,res)=>{
console.log(req.body)
const categorydetails = new category({
  category:req.body.category
})
categorydetails.save()
.then(()=>{
  res.redirect('/adminhome/products')
})
})

// adminside sales details

router.get('/sales',(req,res)=>{
  order.find()
  .then((orders)=>{
    product.find()
    .then((products)=>{
      console.log(products)
      res.render('admin-sales',{orders,products})
    })
    
  })
  
})

module.exports = router;
