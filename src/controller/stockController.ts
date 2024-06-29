import History from '@/models/History'
import Stock from '@/models/stock'
import { Request, Response } from 'express'

class StockController {
  async getStock(req: Request, res: Response) {
    try {
      const symbol = req.params.symbol
      const stock = await Stock.findOne({ symbol })

      // TODO: -if stock not found, do not send 404, send an empty array
      if (!stock) {
        res.status(404).json({ message: 'Stock not found' })
      }

      res.status(200).json(stock)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
    }
  }

  async getStockHistory(req: Request, res: Response) {
    try {
      const symbol = req.params.symbol
      const history = await History.findOne({ symbol })

      if (!history) {
        res.status(404).json({ message: 'Stock not found' })
      }

      res.status(200).json(history)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
    }
  }
}

export default new StockController()
