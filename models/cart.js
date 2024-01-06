const mongoose=require('mongoose')

const CartSchema=mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    // product ek array of product hoga
    products:[
        {
            productId:{
                type:String,
                required:true
            },
            quantity:{
                type:Number,
                default:1
            }
        }
    ]
},{
    timestamps:true
})

module.exports=mongoose.model('Cart',CartSchema)