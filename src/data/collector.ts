import { CronJob } from 'cron'
import yahooFinance from 'yahoo-finance2'
import { stockList } from './stock'
import Stock from '../models/stock'
import History from '../models/history'

export const collector = async () => {
  console.log('start')
  for (const item of stockList) {
    const query = item.symbol
    const queryOptions = {
      period1: '2024-01-01'
    }
    const res1 = await yahooFinance.quote(query)
    const res2 = await yahooFinance.historical(query, queryOptions)

    const quoteData = new Stock({
      symbol: res1.symbol,
      name: res1.longName,
      sector: item.sector,
      last: res1.regularMarketPrice,
      open: res1.regularMarketOpen,
      close: res1.regularMarketPreviousClose,
      vol: res1.regularMarketVolume,
      change: res1.regularMarketChange,
      changePercent: res1.regularMarketChangePercent,
      dayHigh: res1.regularMarketDayHigh,
      dayLow: res1.regularMarketDayLow,
      yearHigh: res1.fiftyTwoWeekHigh,
      yearLow: res1.fiftyTwoWeekLow,
      dividend: res1.dividendYield,
      EPS: res1.epsCurrentYear,
      PE: res1.priceEpsCurrentYear
    })
    await quoteData.save()

    const historyData = new History({
      symbol: item.symbol,
      price: res2
    })
    await historyData.save()
  }
  console.log('data fetch and save successfully')
}

export const job = new CronJob(
  '* * * * *',
  collector,
  null,
  true,
  'America/Los_Angeles'
)
