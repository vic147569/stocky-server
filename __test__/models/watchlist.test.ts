import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import Watchlist from '../../src/models/watchlist'

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
  await Watchlist.deleteMany({})
})

describe('Watchlist Model Test', () => {
  it('should create and save a watchlist successfully', async () => {
    const validWatchlist = new Watchlist({
      userId: '12345',
      stockList: ['AAPL', 'GOOGL']
    })
    const savedWatchlist = await validWatchlist.save()

    expect(savedWatchlist._id).toBeDefined()
    expect(savedWatchlist.userId).toBe(validWatchlist.userId)
    expect(savedWatchlist.stockList).toEqual(
      expect.arrayContaining(validWatchlist.stockList)
    )
  })

  it('should create a watchlist with an empty stock list', async () => {
    const validWatchlist = new Watchlist({
      userId: '12345',
      stockList: []
    })
    const savedWatchlist = await validWatchlist.save()

    expect(savedWatchlist._id).toBeDefined()
    expect(savedWatchlist.userId).toBe(validWatchlist.userId)
    expect(savedWatchlist.stockList).toEqual([])
  })
})
