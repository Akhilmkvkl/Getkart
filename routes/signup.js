const  express = require('express');
const router = express.Router();
const {users,admin}=require('../models/model')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('signup');
});

router.post('/',(req,res)=>{
  const password=req.body.password;
  const confirm=req.body.confirm;
  if(password==confirm)
  {

    const userDetails=new users(
      {
          name:req.body.name,
          email:req.body.email,
          phone:req.body.phone,
          password:req.body.password,
          block:false
          
      })
     
      userDetails.save()
      .then(()=>{
          console.log("User added succesfully")
          
          res.redirect('/login')
      }).catch((err)=>{
          console.log(err)
          res.redirect('/signup')
      })
  }else{
    res.redirect('/signup')
  }
  }
)

module.exports = router;
