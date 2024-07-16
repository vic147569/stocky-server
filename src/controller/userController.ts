import { Request, Response } from 'express'
import User from '../models/user'
import { RequireAuthProp } from '@clerk/clerk-sdk-node'

class UserController {
  async create(req: RequireAuthProp<Request>, res: Response) {
    console.log('controller create user start')
    try {
      const { userId } = req.body
      const existingUser = await User.findOne({ userId })
      if (existingUser) {
        return res.status(200).send('user existed')
      }
      const newUser = new User(req.body)
      await newUser.save()
      console.log('controller create user finish')

      return res.status(201).json(newUser.toObject())
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Create user fail' })
    }
  }

  async get(req: RequireAuthProp<Request>, res: Response) {
    try {
      const currentUser = await User.findOne({ userId: req.auth.userId })
      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' })
      }
      return res.json(currentUser)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Something went wrong' })
    }
  }

  async update(req: RequireAuthProp<Request>, res: Response) {
    try {
      const { name, email, phone } = req.body
      console.log('get req body')
      const user = await User.findOne({ userId: req.auth.userId })
      if (!user) {
        res.status(404).json({ message: 'USer not found' })
      }
      if (user) {
        user.name = name
        user.email = email
        user.phone = phone
        await user.save()
        res.send(user)
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
    }
  }
}

export default new UserController()
