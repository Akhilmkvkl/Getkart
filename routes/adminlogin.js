const  express = require('express');
const session =require('express-session')
const router = express.Router();
const {users,Admin}=require('../models/model')

router.get('/',(req,res)=>{
    if(session.adminlogin){
        users.find((err,docs)=>{
            const num=1;
            if(!err){
                res.render('adminhome',{docs,num})
            }
        })
    }else{
        res.render('adminlogin')
        session.adminloginError=true;
    }
    
});


router.post('/',(req,res,next)=>{

    const adminData=req.body
    Admin.find({email:adminData.email,password:adminData.password})
    .then((result,err)=>{
        console.log(err)
        if(result){
            const num=1;
            session.adminlogin=true;
            console.log('Successfully Logined');
            users.find((err,docs)=>{
                if(!err){
                    
                    res.render('adminhome',{docs,num})
                }
            })
           
        }else{
            session.adminloginError=false;
            res.redirect('/adminlogin')
            console.log("log in failed")
        }    
            
        
    })
    .catch((err)=>{
        console.log(err);
        res.render('adminlogin')
    })

})


module.exports=router;