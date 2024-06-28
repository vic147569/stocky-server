import { CronJob } from 'cron'
import yahooFinance from 'yahoo-finance2'
import { stockList } from './stock'
import Stock from '../models/stock'

const collector = async () => {
  console.log('start')
  for (const item of stockList) {
    const query = item.symbol
    const res = await yahooFinance.quote(query)
    console.log(item.sector)
    const newData = new Stock({
      symbol: res.symbol,
      name: res.longName,
      sector: item.sector,
      last: res.regularMarketPrice,
      change: res.regularMarketChange,
      changePercent: res.regularMarketChangePercent,
      dayHigh: res.regularMarketDayHigh,
      dayLow: res.regularMarketDayLow,
      yearHigh: res.fiftyTwoWeekHigh,
      yearLow: res.fiftyTwoWeekLow,
      EPS: res.epsCurrentYear,
      PE: res.priceEpsCurrentYear
    })
    await newData.save()
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
