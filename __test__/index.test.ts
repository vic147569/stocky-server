/* eslint-disable @typescript-eslint/no-var-requires */

import request from 'supertest'
import { app, server } from '../src/index'
import mongoose from 'mongoose'
import { NextFunction, Request, Response } from 'express'

const auth = {
  sessionId: 'test-session-id',
  userId: 'test-user-id',
  sessionClaims: {
    __raw: '',
    iss: 'issuer',
    sub: 'subject',
    aud: 'audience',
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
    nbf: Math.floor(Date.now() / 1000),
    iat: Math.floor(Date.now() / 1000),
    jti: 'jwt-id',
    sid: 'session-id',
    email: 'test@example.com'
  },
  actor: undefined,
  orgId: undefined,
  orgRole: undefined,
  orgSlug: undefined,
  getToken: jest.fn(),
  orgPermissions: [],
  has: jest.fn(),
  debug: jest.fn()
}

// Mocking the Clerk middleware for testing
jest.mock('@clerk/clerk-sdk-node', () => ({
  ClerkExpressWithAuth: jest.fn(
    () => (req: Request, res: Response, next: NextFunction) => {
      req.auth = auth
      next()
    }
  ),
  ClerkExpressRequireAuth: jest.fn(
    () => (req: Request, res: Response, next: NextFunction) => {
      next()
    }
  )
}))

jest.mock('../src/routes/userRouter', () => {
  const userRouter = require('express').Router()
  userRouter.get('/', (req: Request, res: Response) => res.send('User Router'))
  return userRouter
})

jest.mock('../src/routes/stockRouter', () => {
  const stockRouter = require('express').Router()
  stockRouter.get('/', (req: Request, res: Response) =>
    res.send('Stock Router')
  )
  return stockRouter
})

jest.mock('../src/routes/watchlistRouter', () => {
  const watchlistRouter = require('express').Router()
  watchlistRouter.get('/', (req: Request, res: Response) =>
    res.send('Watchlist Router')
  )
  return watchlistRouter
})

describe('Express App', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
  })

  afterAll(async () => {
    await mongoose.connection.close()
    server.close()
  }, 50000)

  it('should respond with Hello World on GET /test', async () => {
    const res = await request(app).get('/test')
    expect(res.statusCode).toEqual(200)
    expect(res.text).toEqual('Hello World!')
  })

  it('should respond with auth details on GET /test1', async () => {
    const res = await request(app).get('/test1')
    expect(res.statusCode).toEqual(200)
    expect(res.body.userId).toEqual('test-user-id')
  })

  it('should respond with User Router on GET /api/user', async () => {
    const res = await request(app).get('/api/user')
    expect(res.statusCode).toEqual(200)
    expect(res.text).toEqual('User Router')
  })

  it('should respond with Stock Router on GET /api/stocks', async () => {
    const res = await request(app).get('/api/stocks')
    expect(res.statusCode).toEqual(200)
    expect(res.text).toEqual('Stock Router')
  })

  it('should respond with Watchlist Router on GET /api/watchlist', async () => {
    const res = await request(app).get('/api/watchlist')
    expect(res.statusCode).toEqual(200)
    expect(res.text).toEqual('Watchlist Router')
  })
})
