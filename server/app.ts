import express from 'express'
//import { setRoomClient } from './controllers/room.controllers'
// const room_router = require("./routes/room.routes")
import { createClient, RedisClientType } from 'redis'
import { userRouter } from './routes/user.routes'
import { messageRouter } from './routes/message.routes'
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

let io = new Server()

io.on('connection', function(socket) {

  
  socket.on('message', function(data) {
      io.emit('send', data);
  });

  
  socket.on('update_users_count', function(data) {
      io.emit('count_users', data);
  });

});

const app = express()
const port = 3000

app.use(express.json())
app.use('/user', userRouter)
app.use('/message', messageRouter)

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`)
})
