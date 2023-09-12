const express = require("express");
const { createClient } = require("redis");
const { promisify } = require("util");

// const client = createClient({
//     password: '2X2cX7YNHMCfTwZQDSHWpSQNa0DrzfMM',
//     socket: {
//         host: 'redis-12499.c264.ap-south-1-1.ec2.cloud.redislabs.com',
//         port: 12499
//     }
// });

const redisUrl = "redis://default:2X2cX7YNHMCfTwZQDSHWpSQNa0DrzfMM@redis-12499.c264.ap-south-1-1.ec2.cloud.redislabs.com:12499"
const client = createClient(redisUrl)

// if (client) {
//     console.log("Connected");
// }

client.set = promisify(client.set)
client.get = promisify(client.get)
client.del = promisify(client.del)

const app = express();


// await client.set('key', 'helllllo');
// const value = await client.get('key');
// console.log(value);

// await client.hSet('user-session:123', {
//     name: 'John',
//     surname: 'Smith',
//     company: 'Redis',
//     age: 29
// })

// let userSession = await client.hGetAll('user-session:123');
// console.log(JSON.stringify(userSession, null, 2));


const addKeyRedis = async (key, value) => {
    const response = await client.set(key, value)
    console.log({ response, msg: "Key added in redis" });
}

const getKeyRedis = async (key) => {
    const value = await client.get(key)
    // console.log(value);
    return value
}

const removeRedis = async(key) => {
    const deletekey = await client.del(key)
    if(deletekey){
        console.log("Deleted");
        return true
    }
}

const updateRedis = async(key1) => {
    await client.set(key1.key, key1.value)
}

module.exports = { addKeyRedis, getKeyRedis, removeRedis, updateRedis }

// app.post("/", async (req, res) => {
//     const { key, value } = req.body;
//     const response = await client.set(key,value)
//     res.json(response);
// })

// app.get("/", async (req, res) => {
//     const { key } = req.body
//     const value = await client.get(key)
//     res.json({value, msg: "value of key"})
// })

// app.patch("/", async (req, res) => {
//     const { key, value } = req.body
//     const updated = await client.get(key)
//     if (updated) {
//         const final = await client.set(key,value)
//         res.json({final, msg: "value is set"})
//     }
//     else{
//         res.json({msg: "key not found"})
//     }
//     // res.json({updated, msg: "value"})
// })

// app.delete("/", async (req, res) => {
//     const { key } = req.body
//     const deletekey = await client.del(key)
//     if (deletekey) {
//         res.json({deletekey, msg: `your key : ${key} , is deleted`})
//     }
//     else{
//         res.json({msg: "enterd key is not present"})
//     }
// })

// app.listen(8080, () => {
//     console.log("Hey, now port on 8080");
// })