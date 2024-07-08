import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import History from '../../src/models/history'

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
  })
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

afterEach(async () => {
  await History.deleteMany({})
})

describe('History Model Test', () => {
  it('should create and save a history record successfully', async () => {
    const validHistory = new History({
      symbol: 'AAPL',
      price: [
        {
          date: new Date('2022-01-01'),
          open: 150,
          high: 155,
          low: 149,
          close: 154,
          adjClose: 154,
          volume: 1000000
        }
      ]
    })
    const savedHistory = await validHistory.save()

    expect(savedHistory._id).toBeDefined()
    expect(savedHistory.symbol).toBe(validHistory.symbol)
    expect(savedHistory.price.length).toBe(1)
    expect(savedHistory.price[0].date).toEqual(new Date('2022-01-01'))
    expect(savedHistory.price[0].open).toBe(150)
    expect(savedHistory.price[0].high).toBe(155)
    expect(savedHistory.price[0].low).toBe(149)
    expect(savedHistory.price[0].close).toBe(154)
    expect(savedHistory.price[0].adjClose).toBe(154)
    expect(savedHistory.price[0].volume).toBe(1000000)
  })
})
