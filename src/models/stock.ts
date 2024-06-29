import mongoose from 'mongoose'

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String
  },
  name: {
    type: String
  },
  sector: {
    type: String
  },
  last: {
    type: Number
  },
  open: {
    type: Number
  },
  close: {
    type: Number
  },
  vol: {
    type: Number
  },
  change: {
    type: Number
  },
  changePercent: {
    type: Number
  },
  dayHigh: {
    type: Number
  },
  dayLow: {
    type: Number
  },
  yearHigh: {
    type: Number
  },
  yearLow: {
    type: Number
  },
  dividend: {
    type: Number
  },
  EPS: {
    type: Number
  },
  PE: {
    type: Number
  }
})

const Stock = mongoose.model('Stock', stockSchema)

export default Stock
