import watchlistController from '@/controller/watchlistController'
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'
import express from 'express'

const watchlistRouter = express.Router()

watchlistRouter.post('/', ClerkExpressRequireAuth(), watchlistController.create)
watchlistRouter.get('/', ClerkExpressRequireAuth(), watchlistController.get)

export default watchlistRouter
