const redis = require('redis');

(async () => {

  const client = redis.createClient({url:'redis://default:redispw@localhost:55001'});

  const subscriber = client.duplicate();

  await subscriber.connect();

  await subscriber.subscribe('newMessage', (message) => {
    console.log(message); // 'message'
  });
  await subscriber.subscribe('newUser', (message) => {
    console.log(message); // 'message'
  });

})();
