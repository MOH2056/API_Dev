import redis from 'redis';

let client; 

async function getRedisClient() {
    if (!client) {
        client = redis.createClient();

        client.on('error', (err) => console.error('Redis error:', err));
        client.on('connect', () => console.log('Redis connected'));

        await client.connect();
    }
    return client;
}

export default getRedisClient 
