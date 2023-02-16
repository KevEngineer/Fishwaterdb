const client = require("redis");


(async () => {
    redisClient = client.createClient();

    redisClient.on("error", (error) => console.error(`Error : ${error}`));

    await redisClient.connect();
})();

await client.connect();

await client.set('key', 'value');
const value = await client.get('key');
