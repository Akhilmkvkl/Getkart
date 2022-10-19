const  express = require('express');
const session=require('express-session')
const router = express.Router();
const {users,admin}=require('../models/model')
const userhelpers=require('../helpers/otp')
const config=require('../config/config');
const { json } = require('express');
const {ObjectId} = require('mongodb')

router.get('/',(req,res)=>{
    
    if(session.login){
        res.redirect('/');
    }else{
      
    res.render('login',{
      loginerr:session.loginError,
      blockerr:session.blockerr,
      otpErr:session.otpErr
    });
    
      
    
    session.loginError=false;
    session.blockerr=false
    session.otpErr=false
    
    
    }
})

router.post('/',(req,res)=>{
    session.email=req.body.email
    console.log(session.email)
    var log=req.body
  users.findOne({email:log.email,password:log.password,block:false})
  .then((result)=>{
    if(result){
        console.log("User successfully logined")
        users.findOne({email:log.email},{_id:1})
        .then((userid)=>{
          
          session.userid=userid._id
        
          console.log(userid)
        })
      
       users.findOne({email:log.email},{phone:1,_id:0})
       .then((phone)=>{
        if(phone){
          console.log(phone.phone)
          const number=phone.phone
        //   res.render('otp',phone);
        // userhelpers.sendOtp(number)

        // remove this after setting twilio
        session.login=true;
        res.redirect('/')


        }
        
        
       })
       
    }else{
      users.findOne({email:log.email,password:log.password,block:true})
  .then((result)=>{
    if(result){
        res.redirect('/login') 
        session.blockerr=true
        
    }else{
      res.redirect('/login')
      session.loginError=true
    }
  
  })
  
  

  .catch((err)=>{
    console.log(err)
    res.redirect('/login');
  })
   
}})
}),

router.get('/otp',(req,res)=>{
 
  res.render('otp')

}),

// router.post('/variotp',(req,res)=>{
  
//   users.findOne({email:session.email},{phone:1,_id:0})
//   .then((phone)=>{
//     if(phone){
//       console.log(phone.phone)
//       const number=phone.phone
//       userhelpers.veriOtp(req.body.otpval,number).then((verifi) => {
//         console.log(verifi);
//         if (verifi) {
//           session.login=true;
//           console.log("otp success");
//           res.redirect("/");
//         } else {
//           console.log("otp failed");
//           req.session.userid = null;
//           req.session.otpErr = true;
//           res.redirect("/login");
//         }
//       });
//     }
    
   
//   })
  
// })




module.exports=router;