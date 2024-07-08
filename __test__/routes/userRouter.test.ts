/* eslint-disable @typescript-eslint/no-unused-vars */
import request from 'supertest'
import express, { NextFunction, Request, Response } from 'express'
import userRouter from '../../src/routes/userRouter'
import userController from '../../src/controller/userController'
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'
import { JWTParse } from '../../src/middleware/auth'

// Mock the Clerk middleware and JWTParse middleware
jest.mock('@clerk/clerk-sdk-node', () => ({
  ClerkExpressRequireAuth: jest.fn(
    () => (req: Request, res: Response, next: NextFunction) => next()
  )
}))

jest.mock('../../src/middleware/auth', () => ({
  JWTParse: jest.fn((req, res, next) => next())
}))

// Mock the userController methods
jest.mock('../../src/controller/userController', () => ({
  create: jest.fn((req, res) => res.status(201).send('User created')),
  get: jest.fn((req, res) => res.status(200).send('User details')),
  update: jest.fn((req, res) => res.status(200).send('User updated'))
}))

const app = express()
app.use(express.json())
app.use('/api/user', userRouter)

describe('userRouter', () => {
  it('should call create on POST /api/user/', async () => {
    const res = await request(app).post('/api/user/').send({ name: 'John Doe' })
    expect(res.status).toBe(201)
    expect(res.text).toBe('User created')
    expect(userController.create).toHaveBeenCalled()
  })

  it('should call get on GET /api/user/', async () => {
    const res = await request(app).get('/api/user/')
    expect(res.status).toBe(200)
    expect(res.text).toBe('User details')
    expect(userController.get).toHaveBeenCalled()
  })

  it('should call update on PUT /api/user/', async () => {
    const res = await request(app).put('/api/user/').send({ name: 'Jane Doe' })
    expect(res.status).toBe(200)
    expect(res.text).toBe('User updated')
    expect(userController.update).toHaveBeenCalled()
  })
})
