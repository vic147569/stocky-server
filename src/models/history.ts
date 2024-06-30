import mongoose from 'mongoose'

const historySchema = new mongoose.Schema({
  symbol: {
    type: String
  },
  price: [
    {
      date: Date,
      open: Number,
      high: Number,
      low: Number,
      close: Number,
      adjClose: Number,
      volume: Number
    }
  ]
})

const History = mongoose.model('History', historySchema)

export default History
