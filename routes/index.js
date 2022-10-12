const express = require('express');
const session = require('express-session');
const router = express.Router();
const {users,admin}=require('../models/model')


/* GET home page. */
router.get('/', function(req, res, next) {
  users.find()
  .then((docs)=>{
   
    res.render('index',{docs})
  })

  
});

module.exports = router;
