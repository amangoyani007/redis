import { createCluster } from 'redis';

const cluster = createCluster({
    rootNodes: [
        {
            url: 'redis://127.0.0.1:16379'
        },
        {
            url: 'redis://127.0.0.1:16380'
        },
        
    ]
});

cluster.on('error', (err) => console.log('Redis Cluster Error', err));

await cluster.connect();

await cluster.set('foo', 'bar');
const value = await cluster.get('foo');
console.log(value); // returns 'bar'

// await cluster.quit();

// const client = createClient({
//     username: 'default', // use your Redis user. More info https://redis.io/docs/management/security/acl/
//     password: 'secret', // use your password here
//     socket: {
//         host: 'my-redis.cloud.redislabs.com',
//         port: 6379,
//         tls: true,
//         key: readFileSync('./redis_user_private.key'),
//         cert: readFileSync('./redis_user.crt'),
//         ca: [readFileSync('./redis_ca.pem')]
//     }
// });

// client.on('error', (err) => console.log('Redis Client Error', err));

// await client.connect();

// await client.set('foo', 'bar');
// const value2 = await client.get('foo');
// console.log(value2) // returns 'bar'

// await client.disconnect();

// try {
//     await client.ft.create('idx:users', {
//         '$.name': {
//             type: SchemaFieldTypes.TEXT,
//             SORTABLE: true
//         },
//         '$.city': {
//             type: SchemaFieldTypes.TEXT,
//             AS: 'city'
//         },
//         '$.age': {
//             type: SchemaFieldTypes.NUMERIC,
//             AS: 'age'
//         }
//     }, {
//         ON: 'JSON',
//         PREFIX: 'user:'
//     });
// } catch (e) {
//     if (e.message === 'Index already exists') {
//         console.log('Index exists already, skipped creation.');
//     } else {
//         // Something went wrong, perhaps RediSearch isn't installed...
//         console.error(e);
//         process.exit(1);
//     }
// }

