const redis = require('redis');

(async () => {
  require('dotenv').config({path:__dirname+'/../process.dev.env'})
  
  const client = redis.createClient({url:process.env.REDIS_URI});

  const subscriber = client.duplicate();

  await subscriber.connect();

  await subscriber.subscribe('newMessage', (message) => {
    console.log(message); // 'message'
  });
  await subscriber.subscribe('newUser', (message) => {
    console.log(message); // 'message'
  });

})();
