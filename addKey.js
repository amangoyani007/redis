const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
// const { createClient } = require("redis");
// const { promisify } = require("util");

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// const redisUrl = "redis://default:2X2cX7YNHMCfTwZQDSHWpSQNa0DrzfMM@redis-12499.c264.ap-south-1-1.ec2.cloud.redislabs.com:12499"
// const client = createClient(redisUrl)

// client.get = promisify(client.get)

// MONGODB SETUP

mongoose.connect('mongodb://localhost:27017', {
    // useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection
    .once('open', () => console.log('connected to database'))
    .on('error', (err) => console.log("connection to database failed!!", err))

const key = require('./db/mongo');
const { addKeyRedis, getKeyRedis } = require("./main/newIndex");
const { value } = require("promisify");

// app.use(upload.array());
app.use(express.static('public'));

// ROUTES
//data import from mongoDB
app.get('/', (req, res) => {
    key.find({})
        .then((data) => {
            res.json({ found: true, data: data });
        })
        .catch((err) => {
            console.log(err)
            res.json({ found: false, data: null });
        })
})

app.post('/postkey', (req, res) => {
    new key(req.body)
        .save()
        .then((v_data) => {
            console.log(v_data);
            res.json({ save: true })
            addKeyRedis(v_data.key, v_data.value)

            // clearCache(v_data.vehicleType)
        })
        .catch((err) => {
            console.log(err)
            res.json({ save: false })
        })
})
//key from redis
app.get("/key", async (req, res) => {
    const { key } = req.body
    const value = await getKeyRedis(key)
    res.json({msg: `your value is: '${value}'`})})


app.listen(8080, () => console.log("server started at port:8080"))