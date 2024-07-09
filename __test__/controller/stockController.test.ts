/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express'
import Stock from '../../src/models/stock'
import History from '../../src/models/history'
import analyzer from '../../src/data/analyzer'
import StockController from '../../src/controller/stockController'

jest.mock('../../src/models/stock')
jest.mock('../../src/models/history')
jest.mock('../../src/data/analyzer')

describe('StockController', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: jest.Mock

  beforeEach(() => {
    req = {
      params: {}
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    next = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getStock', () => {
    it('should return 200 and the stock data if stock is found', async () => {
      const mockStock = { symbol: 'AAPL', name: 'Apple Inc.' }
      ;(Stock.findOne as jest.Mock).mockResolvedValue(mockStock)

      req.params!.symbol = 'AAPL'

      await StockController.getStock(req as Request, res as Response)

      expect(Stock.findOne).toHaveBeenCalledWith({ symbol: 'AAPL' })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockStock)
    })

    it('should return 404 if stock is not found', async () => {
      ;(Stock.findOne as jest.Mock).mockResolvedValue(null)

      req.params!.symbol = 'AAPL'

      await StockController.getStock(req as Request, res as Response)

      expect(Stock.findOne).toHaveBeenCalledWith({ symbol: 'AAPL' })
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Stock not found' })
    })

    it('should return 500 if an error occurs', async () => {
      ;(Stock.findOne as jest.Mock).mockRejectedValue(new Error('Test error'))

      req.params!.symbol = 'AAPL'

      await StockController.getStock(req as Request, res as Response)

      expect(Stock.findOne).toHaveBeenCalledWith({ symbol: 'AAPL' })
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong' })
    })
  })

  describe('getStockHistory', () => {
    it('should return 200 and the stock history if found', async () => {
      const mockHistory = { symbol: 'AAPL', price: [] }
      ;(History.findOne as jest.Mock).mockResolvedValue(mockHistory)

      req.params!.symbol = 'AAPL'

      await StockController.getStockHistory(req as Request, res as Response)

      expect(History.findOne).toHaveBeenCalledWith({ symbol: 'AAPL' })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockHistory)
    })

    it('should return 404 if stock history is not found', async () => {
      ;(History.findOne as jest.Mock).mockResolvedValue(null)

      req.params!.symbol = 'AAPL'

      await StockController.getStockHistory(req as Request, res as Response)

      expect(History.findOne).toHaveBeenCalledWith({ symbol: 'AAPL' })
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Stock not found' })
    })

    it('should return 500 if an error occurs', async () => {
      ;(History.findOne as jest.Mock).mockRejectedValue(new Error('Test error'))

      req.params!.symbol = 'AAPL'

      await StockController.getStockHistory(req as Request, res as Response)

      expect(History.findOne).toHaveBeenCalledWith({ symbol: 'AAPL' })
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong' })
    })
  })

  describe('getStockRecommendation', () => {
    it('should return 200 and the stock recommendation if stock is found', async () => {
      const mockStock = { symbol: 'AAPL', name: 'Apple Inc.' }
      const mockRecommendation = { recommendation: 'Buy' }
      ;(Stock.findOne as jest.Mock).mockResolvedValue(mockStock)
      ;(analyzer as jest.Mock).mockReturnValue(mockRecommendation)

      req.params!.symbol = 'AAPL'

      await StockController.getStockRecommendation(
        req as Request,
        res as Response
      )

      expect(Stock.findOne).toHaveBeenCalledWith({ symbol: 'AAPL' })
      expect(analyzer).toHaveBeenCalledWith(mockStock)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ result: mockRecommendation })
    })

    it('should return 404 if stock is not found', async () => {
      ;(Stock.findOne as jest.Mock).mockResolvedValue(null)

      req.params!.symbol = 'AAPL'

      await StockController.getStockRecommendation(
        req as Request,
        res as Response
      )

      expect(Stock.findOne).toHaveBeenCalledWith({ symbol: 'AAPL' })
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Stock not found' })
    })

    it('should return 500 if an error occurs', async () => {
      ;(Stock.findOne as jest.Mock).mockRejectedValue(new Error('Test error'))

      req.params!.symbol = 'AAPL'

      await StockController.getStockRecommendation(
        req as Request,
        res as Response
      )

      expect(Stock.findOne).toHaveBeenCalledWith({ symbol: 'AAPL' })
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong' })
    })
  })
})
