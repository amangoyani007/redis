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
const { addKeyRedis, getKeyRedis, removeRedis, updateRedis } = require("./main/newIndex");
const { value } = require("promisify");
const keyModel = require("./db/mongo");

// app.use(upload.array());
app.use(express.static('public'));

// ROUTES
//data import from mongoDB
app.get('/', async (req, res) => {

    const { key } = req.body
    const value = await getKeyRedis(key)
    
    if (value) {
        res.json({ msg: `your value is: '${value}'` })
    }

    if (!value) {
        keyModel.find({})
        .then((data) => {
            res.json({ found: true, data: data });
        })
        .catch((err) => {
            console.log(err)
            res.json({ found: false, data: null });
        })
    }
    
})

app.post('/postkey', (req, res) => {
    new keyModel(req.body)
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

app.delete('/delete', async (req, res) => {
    const key1 = req.body;
    // console.log(key1.key);
    try {
        const task = await keyModel.findOneAndRemove({ key: key1.key });
        if (!task) {
            return res.status(404).json({ msg: `No value with key : ${key}` });
        }
        removeRedis(key1.key)
        if (removeRedis()) {
            res.status(200).json({ message: "Deleted and also deleted from redis" });
        }
        // res.status(200).json({ message: "Deleted" });

    } catch (err) {
        return console.log(err);
    }
})

app.patch('/update', async (req, res) => {
    const key1 = req.body;
    try {
        const task = await keyModel.findOneAndUpdate({ key: key1.key }, req.body)
        if (!task) {
            return res.status(404).json({ msg: `No value with key : ${key}` });
        }
        if (task) {
            updateRedis(key1)
            console.log("updated in redix");
        }

        res.json(task)
    } catch (err) {
        return console.log(err);
    }
})

//key from redis
app.get("/key", async (req, res) => {
    const { key } = req.body
    const value = await getKeyRedis(key)
    if (!value) {
        res.json({ msg: "not found" })
    }
    res.json({ msg: `your value is: '${value}'` })
})


app.listen(8080, () => console.log("server started at port:8080"))