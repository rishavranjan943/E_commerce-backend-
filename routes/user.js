const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyTokenAndCart
} = require("./verifytoken");
const User = require("../models/user");

// update user
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    return res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

// delete user
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const delUser = await User.findByIdAndDelete(req.params.id);
    if (delUser) {
      const { password, ...other } = delUser.toObject();
      return res.status(200).json({ ...other });
    } else return res.status(401).send("User not found");
  } catch (error) {
    return res.status(500).send(error);
  }
});

// GET ALL USER
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({createdAt:-1});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET BY ID
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).send("No user found");
    }
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});


module.exports = router;