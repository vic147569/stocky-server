/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express'
import Watchlist from '../../src/models/watchlist'
import WatchlistController from '../../src/controller/watchlistController'
import { RequireAuthProp, WithAuthProp } from '@clerk/clerk-sdk-node'

jest.mock('../../src/models/watchlist')

describe('WatchlistController', () => {
  let req: RequireAuthProp<Partial<Request>>
  let res: Partial<Response>
  let next: jest.Mock

  beforeEach(() => {
    req = {
      auth: { userId: '12345' },
      body: {},
      params: {}
    } as RequireAuthProp<Partial<Request>>
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    }
    next = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should return 409 if watchlist already exists', async () => {
      ;(Watchlist.findOne as jest.Mock).mockResolvedValue({ userId: '12345' })

      await WatchlistController.create(
        req as RequireAuthProp<Request>,
        res as Response
      )

      expect(Watchlist.findOne).toHaveBeenCalledWith({ userId: '12345' })
      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Watchlist already exist'
      })
    })

    it('should create a new watchlist if not exists', async () => {
      ;(Watchlist.findOne as jest.Mock).mockResolvedValue(null)
      ;(Watchlist.prototype.save as jest.Mock).mockResolvedValue({})
      const mockWatchlist = { userId: '12345', stockList: [] }
      req.body = mockWatchlist

      await WatchlistController.create(
        req as RequireAuthProp<Request>,
        res as Response
      )

      expect(Watchlist.findOne).toHaveBeenCalledWith({ userId: '12345' })
      expect(Watchlist.prototype.save).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(201)
      // expect(res.json).toHaveBeenCalledWith(mockWatchlist)
    })

    it('should handle errors', async () => {
      ;(Watchlist.findOne as jest.Mock).mockRejectedValue(
        new Error('Test error')
      )

      await WatchlistController.create(
        req as RequireAuthProp<Request>,
        res as Response
      )

      expect(Watchlist.findOne).toHaveBeenCalledWith({ userId: '12345' })
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong' })
    })
  })

  describe('get', () => {
    it('should return 404 if watchlist is not found', async () => {
      ;(Watchlist.findOne as jest.Mock).mockResolvedValue(null)

      await WatchlistController.get(
        req as RequireAuthProp<Request>,
        res as Response
      )

      expect(Watchlist.findOne).toHaveBeenCalledWith({ userId: '12345' })
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'watchlist not found' })
    })

    it('should return watchlist if found', async () => {
      const mockWatchlist = { userId: '12345', stockList: ['AAPL'] }
      ;(Watchlist.findOne as jest.Mock).mockResolvedValue(mockWatchlist)

      await WatchlistController.get(
        req as RequireAuthProp<Request>,
        res as Response
      )

      expect(Watchlist.findOne).toHaveBeenCalledWith({ userId: '12345' })
      expect(res.json).toHaveBeenCalledWith(mockWatchlist)
    })

    it('should handle errors', async () => {
      ;(Watchlist.findOne as jest.Mock).mockRejectedValue(
        new Error('Test error')
      )

      await WatchlistController.get(
        req as RequireAuthProp<Request>,
        res as Response
      )

      expect(Watchlist.findOne).toHaveBeenCalledWith({ userId: '12345' })
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'something went wrong' })
    })
  })

  describe('isInWatchlist', () => {
    it('should return false if watchlist is not found', async () => {
      ;(Watchlist.findOne as jest.Mock).mockResolvedValue(null)

      req.params!.symbol = 'AAPL'

      await WatchlistController.isInWatchlist(
        req as WithAuthProp<Request>,
        res as Response
      )

      expect(Watchlist.findOne).toHaveBeenCalledWith({ userId: '12345' })
      expect(res.json).toHaveBeenCalledWith({ isInWatchlist: false })
    })

    it('should return true if symbol is in watchlist', async () => {
      const mockWatchlist = { userId: '12345', stockList: ['AAPL'] }
      ;(Watchlist.findOne as jest.Mock).mockResolvedValue(mockWatchlist)

      req.params!.symbol = 'AAPL'

      await WatchlistController.isInWatchlist(
        req as WithAuthProp<Request>,
        res as Response
      )

      expect(Watchlist.findOne).toHaveBeenCalledWith({ userId: '12345' })
      expect(res.json).toHaveBeenCalledWith({ isInWatchlist: true })
    })

    it('should return false if symbol is not in watchlist', async () => {
      const mockWatchlist = {
        userId: '12345',
        stockList: ['GOOG']
      }
      ;(Watchlist.findOne as jest.Mock).mockResolvedValue(mockWatchlist)

      req.params!.symbol = 'AAPL'

      await WatchlistController.isInWatchlist(
        req as WithAuthProp<Request>,
        res as Response
      )

      expect(Watchlist.findOne).toHaveBeenCalledWith({ userId: '12345' })
      expect(res.json).toHaveBeenCalledWith({ isInWatchlist: false })
    })
  })

  describe('update', () => {
    it('should return 404 if watchlist is not found', async () => {
      ;(Watchlist.findOne as jest.Mock).mockResolvedValue(null)

      req.params!.symbol = 'AAPL'

      await WatchlistController.update(
        req as WithAuthProp<Request>,
        res as Response
      )

      expect(Watchlist.findOne).toHaveBeenCalledWith({ userId: '12345' })
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'watchlist not found' })
    })

    it('should add symbol to watchlist if not already present', async () => {
      const mockWatchlist = {
        userId: '12345',
        stockList: [],
        save: jest.fn().mockResolvedValue(true)
      }
      ;(Watchlist.findOne as jest.Mock).mockResolvedValue(mockWatchlist)

      req.params!.symbol = 'AAPL'

      await WatchlistController.update(
        req as WithAuthProp<Request>,
        res as Response
      )

      expect(Watchlist.findOne).toHaveBeenCalledWith({ userId: '12345' })
      expect(mockWatchlist.stockList).toContain('AAPL')
      expect(mockWatchlist.save).toHaveBeenCalled()
      expect(res.send).toHaveBeenCalledWith(mockWatchlist)
    })

    it('should remove symbol from watchlist if already present', async () => {
      const mockWatchlist = {
        userId: '12345',
        stockList: ['AAPL'],
        save: jest.fn().mockResolvedValue(true)
      }
      ;(Watchlist.findOne as jest.Mock).mockResolvedValue(mockWatchlist)

      req.params!.symbol = 'AAPL'

      await WatchlistController.update(
        req as WithAuthProp<Request>,
        res as Response
      )

      expect(Watchlist.findOne).toHaveBeenCalledWith({ userId: '12345' })
      expect(mockWatchlist.stockList).not.toContain('AAPL')
      expect(mockWatchlist.save).toHaveBeenCalled()
      expect(res.send).toHaveBeenCalledWith(mockWatchlist)
    })

    it('should handle errors', async () => {
      ;(Watchlist.findOne as jest.Mock).mockRejectedValue(
        new Error('Test error')
      )

      req.params!.symbol = 'AAPL'

      await WatchlistController.update(
        req as WithAuthProp<Request>,
        res as Response
      )

      expect(Watchlist.findOne).toHaveBeenCalledWith({ userId: '12345' })
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong' })
    })
  })
})
