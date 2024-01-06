const express=require('express')
const router=express.Router()

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
    verifyTokenAndCart
  } = require("./verifytoken");

const Order=require('../models/order')

router.post('/',verifyToken,async (req,res)=>{
    try {
        const neworder=new Order(req.body)
        const saveorder=await neworder.save()
        if(!saveorder){
            res.status(401).send('Cannot create order')
        }else{
            res.status(200).send(saveorder)
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

router.put('/:id',verifyTokenAndAdmin,async (req,res)=>{
    try {
        const updateorder=await Order.findByIdAndUpdate(req.params.id,{
            $set :req.body
        },{
            new:true
        })
        res.status(200).send(updateorder)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/:id',verifyTokenAndAdmin,async (req,res)=>{
    try {
        const delOrder=await Order.findByIdAndDelete(req.params.id)
        if(!delOrder){
            return res.status(500).send('Order donot exists')
        }else {
            return res.status(200).send(delOrder)
        }
    } catch (error) {
        return res.status(500).send(error)
    }
})

router.get('/:id',verifyTokenAndAuthorization,async (req,res)=>{
    try {
        const order=await Order.find({userId:req.params.id})
        if(!order){
            return res.status(200).send('No order exist')
        }
        else{
            res.status(200).send(order)
        }
    } catch (error) {
       res.status(500).send(error);
    }
})

router.get('/',verifyTokenAndAdmin,async (req,res)=>{
    try {
        const orders=await Order.find();
        res.status(200).send(orders)
    } catch (error) {
        res.status(500).send(error)
    }
})



module.exports=router