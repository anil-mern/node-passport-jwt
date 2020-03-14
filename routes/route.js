const express = require('express');
const env = require('dotenv');

const User = require("../modal/User");
const util = require("../utils/util");

const router = express.Router();

env.config();

router.post('/register', async(req, res) => {
    console.log("req: ", req.body);
    const user = new User({
        userId: util.uuid(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        displayName: req.body.firstName + " " + req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        createdBy: 'admin'
    });

    try {
        const savedUser = await user.save();
        return res.send(savedUser);
    } catch (err) {
        console.log("err:", err);
    }
})


// authenticated routes

module.exports = router;