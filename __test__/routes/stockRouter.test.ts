import request from 'supertest'
import express from 'express'
import stockRouter from '../../src/routes/stockRouter'
import stockController from '../../src/controller/stockController'

// Mock the controller methods
jest.mock('../../src/controller/stockController', () => ({
  getStock: jest.fn((req, res) => res.status(200).send('getStock')),
  getStockHistory: jest.fn((req, res) =>
    res.status(200).send('getStockHistory')
  ),
  getStockRecommendation: jest.fn((req, res) =>
    res.status(200).send('getStockRecommendation')
  )
}))

const app = express()
app.use(express.json())
app.use('/api/stocks', stockRouter)

describe('stockRouter', () => {
  it('should call getStock on GET /api/stocks/quote/:symbol', async () => {
    const res = await request(app).get('/api/stocks/quote/AAPL')
    expect(res.status).toBe(200)
    expect(res.text).toBe('getStock')
    expect(stockController.getStock).toHaveBeenCalled()
  })

  it('should return validation error for invalid symbol on GET /api/stocks/quote/:symbol', async () => {
    const res = await request(app).get('/api/stocks/quote/')
    expect(res.status).toBe(404)
  })

  it('should call getStockHistory on GET /api/stocks/history/:symbol', async () => {
    const res = await request(app).get('/api/stocks/history/AAPL')
    expect(res.status).toBe(200)
    expect(res.text).toBe('getStockHistory')
    expect(stockController.getStockHistory).toHaveBeenCalled()
  })

  it('should return validation error for invalid symbol on GET /api/stocks/history/:symbol', async () => {
    const res = await request(app).get('/api/stocks/history/')
    expect(res.status).toBe(404)
  })

  it('should call getStockRecommendation on GET /api/stocks/recommendation/:symbol', async () => {
    const res = await request(app).get('/api/stocks/recommendation/AAPL')
    expect(res.status).toBe(200)
    expect(res.text).toBe('getStockRecommendation')
    expect(stockController.getStockRecommendation).toHaveBeenCalled()
  })

  it('should return validation error for invalid symbol on GET /api/stocks/recommendation/:symbol', async () => {
    const res = await request(app).get('/api/stocks/recommendation/')
    expect(res.status).toBe(404)
  })
})
