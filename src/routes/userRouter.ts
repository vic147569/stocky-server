import express from 'express'
import userController from '../controller/userController'
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'
// import { JWTParse } from '../middleware/auth'

const userRouter = express.Router()

userRouter.post('/', ClerkExpressRequireAuth(), userController.create)
// userRouter.get('/', ClerkExpressRequireAuth(), JWTParse, userController.get)

export default userRouter
