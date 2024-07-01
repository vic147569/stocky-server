import analyzer, { StockType } from '@/data/analyzer'
import History from '@/models/history'
import Stock from '@/models/stock'
import { Request, Response } from 'express'

class StockController {
  async getStock(req: Request, res: Response) {
    try {
      const symbol = req.params.symbol
      const stock = await Stock.findOne({ symbol })

      if (!stock) {
        return res.status(404).json({ message: 'Stock not found' })
      }
      return res.status(200).json(stock)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Something went wrong' })
    }
  }

  async getStockHistory(req: Request, res: Response) {
    try {
      const symbol = req.params.symbol
      const history = await History.findOne({ symbol })

      if (!history) {
        return res.status(404).json({ message: 'Stock not found' })
      }

      return res.status(200).json(history)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Something went wrong' })
    }
  }

  async getStockRecommendation(req: Request, res: Response) {
    try {
      const symbol = req.params.symbol
      const stock = await Stock.findOne({ symbol })

      if (!stock) {
        return res.status(404).json({ message: 'Stock not found' })
      }

      const result = analyzer(stock as StockType)

      return res.status(200).json({ result })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Something went wrong' })
    }
  }
}

export default new StockController()
