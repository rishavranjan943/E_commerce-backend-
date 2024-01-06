const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const cors=require('cors')
const morgan=require('morgan')



require('dotenv/config')


const app=express()

// routers import
const authRoute=require('./routes/auth')
const userRoute=require('./routes/user')
const productRoute=require('./routes/product')
const cartRoute=require('./routes/cart')
const orderRoute=require('./routes/order')

// cors
app.use(cors())
app.options('*',cors())


// middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use('/public/profile_img', express.static(__dirname + '/public/profile_img'));
app.use('/public/product_img', express.static(__dirname + '/public/product_img'));

// routers use
app.use('/api/auth',authRoute)
app.use('/api/users',userRoute)
app.use('/api/products',productRoute)
app.use('/api/cart',cartRoute)
app.use('/api/orders',orderRoute)

mongoose.connect(process.env.DB_URL)
.then(()=>{
    console.log("Database connection is ready")
})
.catch((err)=>{
    console.log(err)
})


app.listen(process.env.PORT || 5000,()=>{
    console.log("Running")
})