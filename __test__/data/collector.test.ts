/* eslint-disable @typescript-eslint/no-unused-vars */
import { CronJob } from 'cron'
import yahooFinance from 'yahoo-finance2'
import { stockList } from '../../src/data/stock'
import Stock from '../../src/models/stock'
import History from '../../src/models/history'
import { job, collector } from '../../src/data/collector'

jest.mock('yahoo-finance2')
jest.mock('../../src/models/stock')
jest.mock('../../src/models/history')

describe('collector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  afterAll(() => {
    job.stop()
  })

  it('should fetch and save stock and historical data', async () => {
    const mockQuoteData = {
      symbol: 'AAPL',
      longName: 'Apple Inc.',
      regularMarketPrice: 150,
      regularMarketOpen: 145,
      regularMarketPreviousClose: 148,
      regularMarketVolume: 1000000,
      regularMarketChange: 2,
      regularMarketChangePercent: 1.35,
      regularMarketDayHigh: 151,
      regularMarketDayLow: 144,
      fiftyTwoWeekHigh: 180,
      fiftyTwoWeekLow: 130,
      dividendYield: 0.6,
      epsCurrentYear: 5.0,
      priceEpsCurrentYear: 30
    }

    const mockHistoricalData = [
      {
        date: new Date('2024-01-01'),
        open: 145,
        high: 151,
        low: 144,
        close: 150,
        adjClose: 149,
        volume: 1000000
      }
    ]

    ;(yahooFinance.quote as jest.Mock).mockResolvedValue(mockQuoteData)
    ;(yahooFinance.historical as jest.Mock).mockResolvedValue(
      mockHistoricalData
    )

    const mockSave = jest.fn()
    Stock.prototype.save = mockSave
    History.prototype.save = mockSave

    await collector()

    expect(yahooFinance.quote).toHaveBeenCalledTimes(stockList.length)
    expect(yahooFinance.historical).toHaveBeenCalledTimes(stockList.length)
    expect(mockSave).toHaveBeenCalledTimes(stockList.length * 2)

    for (const item of stockList) {
      expect(Stock).toHaveBeenCalledWith(
        expect.objectContaining({
          symbol: mockQuoteData.symbol,
          name: mockQuoteData.longName,
          sector: item.sector,
          last: mockQuoteData.regularMarketPrice,
          open: mockQuoteData.regularMarketOpen,
          close: mockQuoteData.regularMarketPreviousClose,
          vol: mockQuoteData.regularMarketVolume,
          change: mockQuoteData.regularMarketChange,
          changePercent: mockQuoteData.regularMarketChangePercent,
          dayHigh: mockQuoteData.regularMarketDayHigh,
          dayLow: mockQuoteData.regularMarketDayLow,
          yearHigh: mockQuoteData.fiftyTwoWeekHigh,
          yearLow: mockQuoteData.fiftyTwoWeekLow,
          dividend: mockQuoteData.dividendYield,
          EPS: mockQuoteData.epsCurrentYear,
          PE: mockQuoteData.priceEpsCurrentYear
        })
      )
      expect(History).toHaveBeenCalledWith(
        expect.objectContaining({
          symbol: item.symbol,
          price: mockHistoricalData
        })
      )
    }
  })
})
