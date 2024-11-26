const express = require("express");

const Task=require("../Models/Task");
const User = require("../Models/User");
const authMiddleware=require("../Middleware/authmiddleware")
const router=express.Router();

router.use(authMiddleware);


router.post('/',async(req,res)=>{
    const {title,desc,dueDate}=req.body;
    try{
        const task=new Task({title,desc,dueDate,userId:user.id});
        await task.save();
        res.status(201).json(task);
    }catch(error){
        res.status(400).json({error:error.message});
    }
})

router.get('/',async(req,res)=>{
    try{
        const tasks=await Task.find({userId:req.user.id});
        res.json(tasks);

    }catch(error){
        res.status(500).json(error.message);
    }
})

