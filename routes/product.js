const express=require('express')
const router=express.Router()
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
    verifyTokenAndCart
  } = require("./verifytoken");
const Product=require('../models/product')
const multer = require('multer')

const FILE_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, '/tmp/my-uploads')
        //  VALIDATION CHECK
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error("Invalid image type");
        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, "public/product_img");
    },
    filename: function (req, file, cb) {
        // way of naming a file
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // cb(null, file.fieldname + '-' + uniqueSuffix)

        const filename = file.originalname.replace(" ", "-");
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${filename}-${Date.now()}.${extension}`);
    },
});

const upload = multer({ storage: storage });

router.post('/',verifyTokenAndAdmin,upload.single("img"),async(req,res)=>{
    try {
        const file = req.file;
        if (!file) {
          res.status(400).send("No file found");
        }
        const fileName = req.file.filename;
        const basePath = `${req.protocol}://${req.get("host")}/public/product_img/`;
        const newProduct =new Product({
            title:req.body.title,
            desc:req.body.desc,
            img:`${basePath}${fileName}`,
            categories:req.body.categories,
            size:req.body.size,
            color:req.body.color,
            price:req.body.price
        })
        const savedProduct=await newProduct.save()
        res.status(200).send(savedProduct)
    } catch (error) {
        res.status(500).send(error)
    }
})



router.put('/:id',verifyTokenAndAdmin,async (req,res)=>{
    try {
        const updatedProduct=await Product.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{
            new:true
        })
       res.status(200).send(updatedProduct)
    } catch (error) {
        
    }
})


router.get('/',async (req,res)=>{
    const qcat=req.query.category
    try {
        if(qcat){
            const findProduct=await Product.find({categories : {
                $in:[qcat]
            }})
            res.status(200).send(findProduct)
        }
       else{
        const findProduct=await Product.find().sort({createdAt:-1})
        res.status(200).send(findProduct)
       }
    } catch (error) {
        return res.status(400).send(error)
    }
})

router.get('/:id',async (req,res)=>{
    try {
        const findProduct=await Product.findById(req.params.id).sort({createdAt:-1})
        res.status(200).send(findProduct)
    } catch (error) {
        return res.status(400).send(error)
    }
})


router.delete('/:id',verifyTokenAndAdmin,async (req,res)=>{
    try {
        const delProduct=await Product.findByIdAndDelete(req.params.id)
        if(!delProduct){
            return res.status(400).send('Product donot exist')
        }
       res.status(200).send(delProduct);
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports=router