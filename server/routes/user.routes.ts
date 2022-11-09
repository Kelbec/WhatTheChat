import express from 'express';
import { UserController } from '../controllers/user.controllers';
export const userRouter = express.Router();

let userController = new UserController()

userRouter.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

userController.initUserPub()

userRouter.get('/')
userRouter.post('/join', userController.joinChat)
userRouter.get('/list', userController.getUsers)
userRouter.delete('/flush', userController.deleteUsers)

userController.initUsers()