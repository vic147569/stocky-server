import Watchlist from '@/models/watchlist'
import { RequireAuthProp } from '@clerk/clerk-sdk-node'
import { Request, Response } from 'express'

class WatchlistController {
  async create(req: RequireAuthProp<Request>, res: Response) {
    try {
      const existingWatchlist = await Watchlist.findOne({
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

  async get(req: RequireAuthProp<Request>, res: Response) {
    try {
      const currentWatchlist = await Watchlist.findOne({
        userId: req.auth.userId
      })

      if (!currentWatchlist) {
        res.status(404).json({ message: 'watchlist not found' })
      }

      res.json(currentWatchlist)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'something went wrong' })
    }
  }
}

export default new WatchlistController()
