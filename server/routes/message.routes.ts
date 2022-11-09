import express from 'express';
import { MessageController } from '../controllers/message.controllers';
export const messageRouter = express.Router();

let messageController = new MessageController()

messageRouter.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

messageController.initMessagePub()

messageRouter.get('/', messageController.getMessages)
messageRouter.post('/send', messageController.sendMessage);
messageRouter.delete('/delete', messageController.deleteMessages);

messageController.initMessages()