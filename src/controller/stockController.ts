import Stock from '@/models/stock'
import { Request, Response } from 'express'

class StockController {
  async getStock(req: Request, res: Response) {
    try {
      const symbol = req.params.symbol
      const stock = await Stock.findOne({ symbol })

      if (!stock) {
        res.status(404).json({ message: 'Stock not found' })
      }

      res.json(stock)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
    }
  }
}

export default new StockController()
