import { createClient } from 'redis';
import express, { json } from 'express';

const client = createClient();

const app = express()

app.use(json())

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

// await client.set('key', 'value');
// const value = await client.get('key');

// await client.hSet('user-session:123', {
//     name: 'John',
//     surname: 'Smith',
//     company: 'Redis',
//     age: 29
// })

// let userSession = await client.hGetAll('user-session:123');
// console.log(JSON.stringify(userSession, null, 2));

app.post("/", async (req, res) => {
    // res.json({ msg: "hi" })
    const { key, value } = req.body
    const response = await client.set(key, value)
    res.json(response)
})

createClient({
    url: 'redis://127.0.0.1:6380'
  });

  app.listen(8080, () => {
    console.log("Hey, now listen on port 8080!")
});