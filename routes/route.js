const express = require('express');
// const mongoose = require("mongooes");

const router = express.Router();
router.post('/register', (req, res) => {
    res.send("user register route")
})


// authenticated routes

module.exports = router;