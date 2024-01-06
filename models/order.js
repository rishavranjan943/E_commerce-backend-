const mongoose=require('mongoose')

const OrderSchema=mongoose.Schema({
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
    ],
    amount:{
        type:Number,
        required:true
    },
    address:{
        type:Object,
        required:true
    },
    status:{
        type:String,
        default:"Pending"
    }
},{
    timestamps:true
})

module.exports=mongoose.model('Order',OrderSchema)