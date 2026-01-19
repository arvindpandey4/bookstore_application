const redis = require('redis');

let client;

const connectRedis = async () => {
    client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    client.on('error', (err) => console.log('Redis Client Error', err));

    let retries = 5;
    while (retries) {
        try {
            await client.connect();
            console.log('Redis Connected');
            return;
        } catch (err) {
            console.error(`Redis Connection Error (Retries left: ${retries}):`, err.message);
            retries -= 1;
            await new Promise(res => setTimeout(res, 3000));
        }
    }
    console.error('Redis Connection Failed after retries');
};

const getClient = () => client;

module.exports = { connectRedis, getClient };
