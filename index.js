import express, { json } from 'express';
import { createClient } from "redis";
import { promisify } from "util";
const redisUrl = "redis://127.0.0.1:6379"
const client = createClient(redisUrl)

client.set = promisify(client.set)

const app = express()

app.use(json())


app.post("/", async (req, res) => {
    // res.json({ msg: "hi" })
    const { key, value } = req.body
    const response = await client.set(key, value)
    res.json({response, msg: "key is set"})
})

app.get("/", async (req, res) => {
    const { key } = req.body
    const value = await client.get(key)
    res.json({value, msg: "value of key"})
})


app.listen(8080, () => {
    console.log("Hey, now listen on port 8080!")
});

// client.connect().catch(console.error)