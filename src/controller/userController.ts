import { Request, Response } from 'express'
import User from '../models/user'
import { RequireAuthProp } from '@clerk/clerk-sdk-node'

class UserController {
  async create(req: RequireAuthProp<Request>, res: Response) {
    try {
      const { userId } = req.body
      const existingUser = await User.findOne({ userId })
      if (existingUser) {
        return res.status(200).send('user existed')
      }
      const newUser = new User(req.body)
      newUser.save()

      res.status(201).json(newUser.toObject())
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Create user fail' })
    }
  }

  async get(req: RequireAuthProp<Request>, res: Response) {
    try {
      const currentUser = await User.findOne({ userId: req.auth.userId })
      if (!currentUser) {
        res.status(404).json({ message: 'User not found' })
      }
      res.json(currentUser)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
    }
  }
}

export default new UserController()
