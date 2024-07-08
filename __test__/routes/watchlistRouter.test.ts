import request from 'supertest'
import express, { NextFunction, Request, Response } from 'express'
import watchlistRouter from '../../src/routes/watchlistRouter'
import watchlistController from '../../src/controller/watchlistController'
// import {
//   ClerkExpressRequireAuth,
//   ClerkExpressWithAuth
// } from '@clerk/clerk-sdk-node'
// import { param } from 'express-validator'

// Mock the Clerk middleware
jest.mock('@clerk/clerk-sdk-node', () => ({
  ClerkExpressRequireAuth: jest.fn(
    () => (req: Request, res: Response, next: NextFunction) => next()
  ),
  ClerkExpressWithAuth: jest.fn(
    () => (req: Request, res: Response, next: NextFunction) => next()
  )
}))

// Mock the watchlistController methods
jest.mock('../../src/controller/watchlistController', () => ({
  create: jest.fn((req, res) => res.status(201).send('Watchlist created')),
  get: jest.fn((req, res) => res.status(200).send('Watchlist details')),
  isInWatchlist: jest.fn((req, res) =>
    res.status(200).send('Stock is in watchlist')
  ),
  update: jest.fn((req, res) => res.status(200).send('Watchlist updated'))
}))

const app = express()
app.use(express.json())
app.use('/api/watchlist', watchlistRouter)

describe('watchlistRouter', () => {
  it('should call create on POST /api/watchlist/', async () => {
    const res = await request(app)
      .post('/api/watchlist/')
      .send({ symbol: 'AAPL' })
    expect(res.status).toBe(201)
    expect(res.text).toBe('Watchlist created')
    expect(watchlistController.create).toHaveBeenCalled()
  })

  it('should call get on GET /api/watchlist/', async () => {
    const res = await request(app).get('/api/watchlist/')
    expect(res.status).toBe(200)
    expect(res.text).toBe('Watchlist details')
    expect(watchlistController.get).toHaveBeenCalled()
  })

  it('should call isInWatchlist on GET /api/watchlist/:symbol', async () => {
    const res = await request(app).get('/api/watchlist/AAPL')
    expect(res.status).toBe(200)
    expect(res.text).toBe('Stock is in watchlist')
    expect(watchlistController.isInWatchlist).toHaveBeenCalled()
  })

  it('should call update on PUT /api/watchlist/:symbol', async () => {
    const res = await request(app)
      .put('/api/watchlist/AAPL')
      .send({ symbol: 'AAPL' })
    expect(res.status).toBe(200)
    expect(res.text).toBe('Watchlist updated')
    expect(watchlistController.update).toHaveBeenCalled()
  })
})
