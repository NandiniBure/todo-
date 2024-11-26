const express =require('express');
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const User = require('../Models/User')

const router=express.Router();

router.post('/register',async(req,res)=>{
    const{username,email,password}=req.body;
    try{
        const hashedpassword=await bcrypt.hash(password,10);
        const user=new User({username,email,password:hashedpassword});
        await user.save();
        res.status(200).json({message:"User registered successfully"});
    }catch(error){
        res.status(400).json({error:error.message})
    }
})


router.post('/login',async(req,res)=>{

    const {email,password}=req.body;

    try{
        const user=await User.findOne({email});
        if(!user) return res.status(400).json({error:'user not found'})

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch) return res.status(400).json({error:"Invalid credentials"})

        const accessToken=jwt.sign({id:user._id},"MYSECRETACCESS",
            {expiresIn:'15m'})
        const refrenceToken=jwt.sign({id:user._id},"MYREFRESHTOKENSECRET",{expiresIn:'7d'});
    }catch(error){
        res.status(500).json({error:error.message})
    }
})

router.post('/refresh',(req,res)=>{

    const {refrenceToken}=req.body;
    if(!refrenceToken) return res.status(401).json({error:"NO refrence token"
    })

    try{
        const verified=jwt.verify(refrenceToken,"MYREFRESHTOKENSECRET");
    const newAccressToken=jwt.sign({id:verified.id},"MYSECRETACCESS",{expiresIn:'15m'});
    res.json({accessToken:newAccressToken})
}catch(err){
    res.status(403).json({error:"Invalid refrence token"})
}
})

module.exports=router;