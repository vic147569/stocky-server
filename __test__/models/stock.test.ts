import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import Stock from '../../src/models/stock'

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

afterEach(async () => {
  await Stock.deleteMany({})
})

describe('Stock Model Test', () => {
  it('should create and save a stock record successfully', async () => {
    const validStock = new Stock({
      symbol: 'AAPL',
      name: 'Apple Inc.',
      sector: 'Technology',
      last: 150,
      open: 145,
      close: 150,
      vol: 1000000,
      change: 5,
      changePercent: 3.45,
      dayHigh: 151,
      dayLow: 144,
      yearHigh: 200,
      yearLow: 100,
      dividend: 0.82,
      EPS: 3.28,
      PE: 30.67
    })
    const savedStock = await validStock.save()

    expect(savedStock._id).toBeDefined()
    expect(savedStock.symbol).toBe(validStock.symbol)
    expect(savedStock.name).toBe(validStock.name)
    expect(savedStock.sector).toBe(validStock.sector)
    expect(savedStock.last).toBe(validStock.last)
    expect(savedStock.open).toBe(validStock.open)
    expect(savedStock.close).toBe(validStock.close)
    expect(savedStock.vol).toBe(validStock.vol)
    expect(savedStock.change).toBe(validStock.change)
    expect(savedStock.changePercent).toBe(validStock.changePercent)
    expect(savedStock.dayHigh).toBe(validStock.dayHigh)
    expect(savedStock.dayLow).toBe(validStock.dayLow)
    expect(savedStock.yearHigh).toBe(validStock.yearHigh)
    expect(savedStock.yearLow).toBe(validStock.yearLow)
    expect(savedStock.dividend).toBe(validStock.dividend)
    expect(savedStock.EPS).toBe(validStock.EPS)
    expect(savedStock.PE).toBe(validStock.PE)
  })
})
