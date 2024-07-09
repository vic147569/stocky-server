/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express'
import User from '../../src/models/user'
import UserController from '../../src/controller/userController'
import { RequireAuthProp } from '@clerk/clerk-sdk-node'

jest.mock('../../src/models/user')

describe('UserController', () => {
  let req: RequireAuthProp<Partial<Request>>
  let res: Partial<Response>
  let next: jest.Mock

  beforeEach(() => {
    req = {
      auth: { userId: '12345' },
      body: {}
    } as RequireAuthProp<Partial<Request>>
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    }
    next = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should return 200 if user already exists', async () => {
      ;(User.findOne as jest.Mock).mockResolvedValue({ userId: '12345' })

      req.body.userId = '12345'

      await UserController.create(
        req as RequireAuthProp<Request>,
        res as Response
      )

      expect(User.findOne).toHaveBeenCalledWith({ userId: '12345' })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith('user existed')
    })

    it('should create a new user if not exists', async () => {
      ;(User.findOne as jest.Mock).mockResolvedValue(null)
      ;(User.prototype.save as jest.Mock).mockResolvedValue({})
      const mockUser = { userId: '12345', name: 'John Doe' }
      req.body = mockUser

      await UserController.create(
        req as RequireAuthProp<Request>,
        res as Response
      )

      expect(User.findOne).toHaveBeenCalledWith({ userId: '12345' })
      expect(User.prototype.save).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(201)
    })

    it('should handle errors', async () => {
      ;(User.findOne as jest.Mock).mockRejectedValue(new Error('Test error'))

      req.body.userId = '12345'

      await UserController.create(
        req as RequireAuthProp<Request>,
        res as Response
      )

      expect(User.findOne).toHaveBeenCalledWith({ userId: '12345' })
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'Create user fail' })
    })
  })

  describe('get', () => {
    it('should return 404 if user is not found', async () => {
      ;(User.findOne as jest.Mock).mockResolvedValue(null)

      await UserController.get(req as RequireAuthProp<Request>, res as Response)

      expect(User.findOne).toHaveBeenCalledWith({ userId: '12345' })
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' })
    })

    it('should return user if found', async () => {
      const mockUser = { userId: '12345', name: 'John Doe' }
      ;(User.findOne as jest.Mock).mockResolvedValue(mockUser)

      await UserController.get(req as RequireAuthProp<Request>, res as Response)

      expect(User.findOne).toHaveBeenCalledWith({ userId: '12345' })
      expect(res.json).toHaveBeenCalledWith(mockUser)
    })

    it('should handle errors', async () => {
      ;(User.findOne as jest.Mock).mockRejectedValue(new Error('Test error'))

      await UserController.get(req as RequireAuthProp<Request>, res as Response)

      expect(User.findOne).toHaveBeenCalledWith({ userId: '12345' })
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong' })
    })
  })

  describe('update', () => {
    it('should return 404 if user is not found', async () => {
      ;(User.findOne as jest.Mock).mockResolvedValue(null)

      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890'
      }

      await UserController.update(
        req as RequireAuthProp<Request>,
        res as Response
      )

      expect(User.findOne).toHaveBeenCalledWith({ userId: '12345' })
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'USer not found' })
    })

    it('should update user if found', async () => {
      const mockUser = {
        userId: '12345',
        name: 'Old Name',
        email: 'old@example.com',
        phone: '0987654321',
        save: jest.fn().mockResolvedValue(true)
      }
      ;(User.findOne as jest.Mock).mockResolvedValue(mockUser)

      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890'
      }

      await UserController.update(
        req as RequireAuthProp<Request>,
        res as Response
      )

      expect(User.findOne).toHaveBeenCalledWith({ userId: '12345' })
      expect(mockUser.save).toHaveBeenCalled()
      expect(res.send).toHaveBeenCalledWith(mockUser)
    })

    it('should handle errors', async () => {
      ;(User.findOne as jest.Mock).mockRejectedValue(new Error('Test error'))

      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890'
      }

      await UserController.update(
        req as RequireAuthProp<Request>,
        res as Response
      )

      expect(User.findOne).toHaveBeenCalledWith({ userId: '12345' })
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong' })
    })
  })
})
