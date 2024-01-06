const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')


const User = require('../models/user')
const router = express.Router()

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
        cb(uploadError, "public/profile_img");
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

router.post('/register', upload.single("profile"),async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
          res.status(400).send("No file found");
        }
        const fileName = req.file.filename;
        const basePath = `${req.protocol}://${req.get("host")}/public/profile_img/`;
        const newUser = new User({
            name: req.body.name,
            profile: `${basePath}${fileName}`,
            email: req.body.email,
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10),
            isAdmin: req.body.isAdmin
        });
        const saved = await newUser.save();
        return res.status(200).send(saved);
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        if (!user) {
            return res.status(401).send('User not found')
        }
        if (user) {
            const isPassword = bcrypt.compareSync(req.body.password, user.password)
            if (!isPassword) {
                return res.status(401).send("Wrong password")
            }
            if (isPassword) {
                const { password, ...others } = user.toObject()
                const accesstoken = jwt.sign({
                    id: user._id,
                    isAdmin: user.isAdmin
                }, process.env.JWT_SECRET, {
                    expiresIn: '1d'
                })
                return res.status(200).json({ ...others, accesstoken })
            }
        }
        return res.status(401).send("User not found")
    } catch (error) {
        return res.status(500).send(error)
    }
})



module.exports = router