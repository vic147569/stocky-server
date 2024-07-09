export type StockType = {
  symbol: string
  name: string
  sector: string
  last: number
  open: number
  close: number
  vol: number
  change: number
  changePercent: number
  dayHigh: number
  dayLow: number
  yearHigh: number
  yearLow: number
  dividend: number
  EPS: number
  PE: number
}

const analyzer = (stock: StockType) => {
  let score = 0

  if (stock.EPS > 3) score += 1
  if (stock.EPS < 0) score -= 1
  if (stock.PE < 25) score += 1
  if (stock.PE > 25) score -= 1
  if (stock.changePercent > 2) score += 1
  if (stock.changePercent < -2) score -= 1
  if (stock.last > (stock.yearHigh + stock.yearLow) / 2) score += 1
  if (stock.last < (stock.yearHigh + stock.yearLow) / 2) score -= 1

  let res = ''

  if (score >= 3) res = 'Strong Buy'
  if (score > 0 && score < 3) res = 'Buy'
  if (score === 0) res = 'Hold'
  if (score > -3 && score < 0) res = 'Sell'
  if (score <= -3) res = 'Strong Sell'

  return res
}

export default analyzer
