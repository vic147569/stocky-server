import mongoose from 'mongoose'

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: String
  },
  stockList: [String]
})

const Watchlist = mongoose.model('Watchlist', watchlistSchema)

export default Watchlist
