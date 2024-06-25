import { Request, Response } from 'express'
import User from '../models/user'

class UserController {
  async create(req: Request, res: Response) {
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
      res.status(500).send({ message: 'Create user fail' })
    }
  }
}

export default new UserController()
