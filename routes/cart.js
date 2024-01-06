const express=require('express')
const router=express.Router()

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
    verifyTokenAndCart,
    verifyTokenAndCartForUser
  } = require("./verifytoken");
const Cart=require('../models/cart')

router.post('/',verifyToken,async (req,res)=>{
    try {
        const newCart=new Cart(req.body)
        const savedCart=await newCart.save()
        res.status(200).send(savedCart)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.put('/:id',verifyTokenAndCart,async (req,res)=>{
    try {
        const updatedCart=await Cart.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{
            new:true
        })
        res.status(200).send(updatedCart)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/:id',verifyTokenAndCart,async (req,res)=>{
    try {
        const delCart=await Cart.findByIdAndDelete(req.params.id)
        if(!delCart){
            return res.status(500).send('Cart donot exists')
        }else {
            return res.status(200).send(delCart)
        }
    } catch (error) {
        return res.status(500).send(error)
    }
})


router.get('/:id',verifyTokenAndAuthorization,async (req,res)=>{
    try {
        const cart=await Cart.findOne({userId:req.params.id})
        if(!cart){
            return res.status(404).send('No cart exist')
        }
        else{
            return res.status(200).send(cart)
        }
    } catch (error) {
       res.status(500).send(error)
    }
})


router.get('/',verifyTokenAndAdmin,async (req,res)=>{
    try {
        const carts=await Cart.find();
        res.status(200).send(carts)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports=router