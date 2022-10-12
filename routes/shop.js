const  express = require('express');
const session=require('express-session')
const router = express.Router();
const {users,admin}=require('../models/model')
const product=require("../models/product")

router.get('/',(req,res)=>{
    
    product.find({category:"shoes"})
    .then((docs)=>{
        
        console.log(session.userid)
        res.render('shop',{docs})
    })
    .catch((err)=>{
        console.log(err)
    })
    
})

router.get('/watches',(req,res)=>{
    
    product.find({category:"watches"})
    .then((docs)=>{
        console.log(docs)
       
        res.render('shop',{docs})
    })
    .catch((err)=>{
        console.log(err)
    })
    
    
})

router.get('/sunglass',(req,res)=>{
    
    product.find({category:"sunglass"})
    .then((docs)=>{
        console.log(docs)

        res.render('shop',{docs})
    })
    .catch((err)=>{
        console.log(err)
    })
    
})



module.exports=router;