import watchlistController from '@/controller/watchlistController'
import {
  ClerkExpressRequireAuth,
  ClerkExpressWithAuth
} from '@clerk/clerk-sdk-node'
import express from 'express'
import { param } from 'express-validator'

const watchlistRouter = express.Router()

watchlistRouter.post('/', ClerkExpressRequireAuth(), watchlistController.create)
watchlistRouter.get('/', ClerkExpressRequireAuth(), watchlistController.get)
watchlistRouter.get(
  '/:symbol',
  param('symbol').isString().trim().notEmpty(),
  ClerkExpressWithAuth(),
  watchlistController.isInWatchlist
)
watchlistRouter.put(
  '/:symbol',
  param('symbol').isString().trim().notEmpty(),
  ClerkExpressWithAuth({}),
  watchlistController.update
)

export default watchlistRouter
