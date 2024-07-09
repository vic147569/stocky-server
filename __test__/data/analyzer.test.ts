import analyzer, { StockType } from '../../src/data/analyzer'

describe('analyzer', () => {
  it('should return "Strong Buy" when score is 3', () => {
    const stock: StockType = {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      sector: 'Technology',
      last: 160,
      open: 150,
      close: 155,
      vol: 1000000,
      change: 5,
      changePercent: 3,
      dayHigh: 160,
      dayLow: 140,
      yearHigh: 200,
      yearLow: 100,
      dividend: 1.5,
      EPS: 4,
      PE: 20
    }

    const result = analyzer(stock)
    expect(result).toBe('Strong Buy')
  })

  it('should return "Buy" when score is between 1 and 2', () => {
    const stock: StockType = {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      sector: 'Technology',
      last: 160,
      open: 150,
      close: 155,
      vol: 1000000,
      change: 3,
      changePercent: 1,
      dayHigh: 160,
      dayLow: 140,
      yearHigh: 200,
      yearLow: 100,
      dividend: 1.5,
      EPS: 4,
      PE: 30
    }

    const result = analyzer(stock)
    expect(result).toBe('Buy')
  })

  it('should return "Hold" when score is 0', () => {
    const stock: StockType = {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      sector: 'Technology',
      last: 150,
      open: 150,
      close: 150,
      vol: 1000000,
      change: 0,
      changePercent: 0,
      dayHigh: 150,
      dayLow: 150,
      yearHigh: 200,
      yearLow: 100,
      dividend: 1.5,
      EPS: 3,
      PE: 25
    }

    const result = analyzer(stock)
    expect(result).toBe('Hold')
  })

  it('should return "Sell" when score is between -1 and -2', () => {
    const stock: StockType = {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      sector: 'Technology',
      last: 140,
      open: 150,
      close: 145,
      vol: 1000000,
      change: -3,
      changePercent: -1,
      dayHigh: 150,
      dayLow: 140,
      yearHigh: 200,
      yearLow: 100,
      dividend: 1.5,
      EPS: 2,
      PE: 30
    }

    const result = analyzer(stock)
    expect(result).toBe('Sell')
  })

  it('should return "Strong Sell" when score is -3', () => {
    const stock: StockType = {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      sector: 'Technology',
      last: 90,
      open: 100,
      close: 95,
      vol: 1000000,
      change: -5,
      changePercent: -3,
      dayHigh: 100,
      dayLow: 90,
      yearHigh: 200,
      yearLow: 100,
      dividend: 1.5,
      EPS: -1,
      PE: 30
    }

    const result = analyzer(stock)
    expect(result).toBe('Strong Sell')
  })
})
