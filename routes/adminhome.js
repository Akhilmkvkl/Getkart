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
const category = require("../models/category model");
const coupon = require("../models/coupon model");
const excelJs = require("exceljs");
const { resolveInclude } = require("ejs");

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
  category.find().then((cat) => {
    res.render("add-product", { docs: "", cat });
  });
});

router.post("/addproduct", upload.any(), (req, res) => {
  const products = new product({
    name: req.body.name,
    price: req.body.price,
    discription: req.body.discription,
    stock: req.body.stock,
    category: req.body.category,
    sellingprice:req.body.price,
    constsellingprice:req.body.price,
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
      category.find().then((cat) => {
        res.render("add-product", { docs, cat });
      });
    }
  });
});

router.get("/orders", (req, res) => {
  if (session.adminlogin) {
    order
      .find({ orderconfirmed: false, delivered: false, status: "placed" })
      .then((docs) => {
        console.log(docs);
        res.render("adminorder", { docs });
      });
  } else {
    res.redirect("/adminlogin");
  }
});
router.get("/confirm", (req, res) => {
  const id = req.query.id;
  order
    .updateOne(
      { _id: id },
      { $set: { orderconfirmed: true, status: "confirmed" } }
    )
    .then(() => {
      res.redirect("/adminhome/orders");
    });
});
router.get("/confirmed", (req, res) => {
  order
    .find({ orderconfirmed: true, delivered: false, status: "confirmed" })
    .then((docs) => {
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
  order
    .updateOne({ _id: id }, { $set: { delivered: true, status: "delivered" } })
    .then(() => {
      res.redirect("/adminhome/confirmed");
    });
});

router.get("/cancelled", (req, res) => {
  order.find({ status: "cancelled" }).then((docs) => {
    res.render("adminorder", { docs });
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

///order cancellation

router.get("/cancell", (req, res) => {
  const id = req.query.id;
  order.updateOne({ _id: id }, { $set: { status: "cancelled" } }).then(() => {
    res.redirect("/adminhome/orders");
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
router.post("/add-category", (req, res) => {
  console.log(req.body);
  const categorydetails = new category({
    category: req.body.category,
  });
  categorydetails.save().then(() => {
    res.redirect("/adminhome/products");
  });
});

// adminside sales details via 

router.get("/sales", (req, res) => {
 const  label=[]
 const key=[]

  order
    .aggregate([
      {
        $group: {
          _id: "$currentmonth",count:{$sum:1}
         
        },
      },
    ])
    .then((salesreport) => {
      console.log(salesreport);
      for(i=0;i<salesreport.length;i++){
        key.push(salesreport[i]._id)
        label.push(salesreport[i].count)
      }
      console.log("hii all",label);
      console.log(key);
      res.render("admin-sales",{salesreport,label,key});
    });
});

//coupon management

router.post("/add-coupon", (req, res) => {
  console.log(req.body);
  if(req.body){
    const coupondetails = new coupon({
      couponid: req.body.couponId,
      couponvalue: req.body.value,
      minamount: req.body.minvalue,
      maxamount: req.body.maxamount,
      uptodate: req.body.enddate,
      fromdate: req.body.actdate,
    });
    coupondetails.save().then(() => {
      console.log("coupon added successfully");
      res.redirect("/adminhome/coupon");
    })
    .catch(()=>{
      res.redirect("/adminhome/coupon");
    });
    
  }else{
    res.redirect("/adminhome/coupon");
  }
  
});

//excel chart operation 
router.get("/export_to_excel", (req, res) => {
   order.find()
  .then((SalesReport)=>{
    

 console.log(SalesReport)
  try {
    const workbook = new excelJs.Workbook();

    const worksheet = workbook.addWorksheet("Sales Report");

    worksheet.columns = [
      { header: "S no.", key: "s_no" },
      { header: "OrderID", key: "_id" },
      { header: "Date", key: "Date" },
      { header: "Products", key: "prod" },
      { header: "Method", key: "payment" },
      { header: "status", key: "status" },
      { header: "Amount", key: "amount" },
    ];
    let counter = 1;
    SalesReport.forEach((report) => {
      report.s_no = counter;
      report.prod = "";
      // report.name = report.userid;
      report.products.forEach((eachproduct) => {
        report.prod += eachproduct.productname + ", ";
      });
      worksheet.addRow(report);
      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    

    res.header(
      "Content-Type",
      "application/vnd.oppenxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.header("Content-Disposition", "attachment; filename=report.xlsx");

    workbook.xlsx.write(res);
  } catch (err) {
    console.log(err.message);
  }
});
});
// excel sales report end

router.get('/coupon',(req,res)=>{
  coupon.find()
  .then((coupons)=>{
    if(coupons){
      res.render('coupon',{coupons})
    }else{
      res.render('coupon',{coupons:""})
    }
  })
  
 
})


router.post('/delete-coupon',(req,res)=>{
  const id=req.query.id
  coupon.deleteOne({_id:id})
  .then(()=>{
    res.redirect('/adminhome/coupon')
  })
  .catch(()=>{
    res.redirect('/adminhome/coupon')
  })
})
module.exports = router;
