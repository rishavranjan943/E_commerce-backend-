const jwt=require('jsonwebtoken')
const Cart=require('../models/cart')


const verifyToken=(req,res,next)=>{
    const authHeader=req.headers.token
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            if(err){
                console.error('Token verification error:', err);
                return res.status(401).json('Token not valid')
            }
            req.user=user 
            next()
        })
    } else {
        return res.status(401).json('You are not authenticated')
    }
}

const verifyTokenAndAuthorization=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin || req.user.id===req.params.id){
            next()
        }
        else if(req.user.id!==req.params.id){
            return res.status(401).send('User not found')
        }
        else {
            return res.status(401).send('You are not allowed to do that')
        }
    })
}

const verifyTokenAndAdmin=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next()
        } else {
            return res.status(500).send('You are not allowed to do that')
        }
    })
}

const verifyTokenAndCart=(req,res,next)=>{
    verifyToken(req,res,()=>{
            const carts=Cart.findById(req.params.id)
            if(!carts){
                return res.status(400).send('No cart found')
            }
            if(carts||req.user.isAdmin){
                next()
            }
        
    })
}

module.exports={
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
    verifyTokenAndCart
}