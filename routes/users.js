const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("config");
const router = express.Router();

const { body, validationResult } = require("express-validator");

const User = require("../models/User");

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post(
  "/",
  body("name", "Name is required").notEmpty(),
  body("email", "Invalid email format").isEmail(),
  body("password", "Enter a password with more than 6 characters").isLength({ min: 6 }), 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const {name, email ,password} = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({msg: "User already exists"});

        user = new User({
            name, 
            email, 
            password
        })

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        const payload = {
            user : {
                id: user.id
            }
        }

        jwt.sign(payload, config.get("JWT_SECRET"), {
            expiresIn: 36000
        }, (err, token) => {
            if (err) throw err;
            res.status(200).json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error...');
    }
  }
);

module.exports = router;
