import { NextFunction, Request, Response } from 'express'
import User from '../models/user'

export const JWTParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth.userId
    const user = await User.findOne({ userId })
    if (!user) {
      res.status(401)
    }
    next()
  } catch (error) {
    res.sendStatus(401)
  }
}
