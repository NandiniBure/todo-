const jwt=require('jsonwebtoken');

module.exports=(req,res,next)=>{
    const token=req.header('Authorization');
    if(!token) return res.status(401).json({error:'Access denied'});

    try{
        const verified=jwt.verified(token,"MYSECRETACCESS");
        req.user=verified;
        next();
    }catch(error){
        res.status(400).json({error:'Invalid TOken'})
    }
}