import express, { json } from "express";
import {createClient} from "redis";
import { promisify } from "util";

const redisUrl = "redis://127.0.0.1:6379"
const client = createClient(redisUrl)

client.set = promisify(client.set)
client.get = promisify(client.get)
client.del = promisify(client.del)

const app = express();

app.use(json())

app.post("/", async (req, res) => {
    const { key, value } = req.body;
    const response = await client.set(key,value)
    res.json(response);
})

app.get("/", async (req, res) => {
    const { key } = req.body
    const value = await client.get(key)
    res.json({value, msg: "value of key"})
})

app.patch("/", async (req, res) => {
    const { key, value } = req.body
    const updated = await client.get(key)
    if (updated) {
        const final = await client.set(key,value)
        res.json({final, msg: "value is set"})
    }
    else{
        res.json({msg: "key not found"})
    }
    // res.json({updated, msg: "value"})
})

app.delete("/", async (req, res) => {
    const { key } = req.body
    const deletekey = await client.del(key)
    if (deletekey) {
        res.json({deletekey, msg: `your key : ${key} , is deleted`})
    }
    else{
        res.json({msg: "enterd key is not present"})
    }
})

app.listen(8080, () => {
    console.log("Hey, now port on 8080");
})