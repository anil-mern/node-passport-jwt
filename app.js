const express = require('express');
const env = require('dotenv');
const router = require('./routes/route');

const app = express();
env.config();

app.use("/api/user", router);

app.get('/', (req, res) => {
    res.json({ "text": "hello-world" })
});

app.listen(process.env.API_PORT, () => {
    console.log("api server up, running at:", process.env.API_PORT)
});