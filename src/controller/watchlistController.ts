import Watchlist from '@/models/watchlist'
import { RequireAuthProp } from '@clerk/clerk-sdk-node'
import { Request, Response } from 'express'

class WatchlistController {
  async create(req: RequireAuthProp<Request>, res: Response) {
    try {
      const existingWatchlist = await Watchlist.find({
        userId: req.auth.userId
      })

      if (existingWatchlist) {
        return res.status(409).json({ message: 'Watchlist already exist' })
      }

      const watchlist = new Watchlist(req.body)
      await watchlist.save()

      res.status(201).json(watchlist)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
    }
  }
}

export default new WatchlistController()
