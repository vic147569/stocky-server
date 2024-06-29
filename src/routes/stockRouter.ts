import stockController from '@/controller/stockController'
import express from 'express'
import { param } from 'express-validator'

const stockRouter = express.Router()

stockRouter.get(
  '/quote/:symbol',
  param('symbol')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Please enter a valid stock symbol'),
  stockController.getStock
)

stockRouter.get(
  '/history/:symbol',
  param('symbol')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Please enter a valid stock symbol'),
  stockController.getStockHistory
)

export default stockRouter
