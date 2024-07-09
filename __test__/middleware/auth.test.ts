import { NextFunction, Request, Response } from 'express'
import User from '../../src/models/user'
import { JWTParse } from '../../src/middleware/auth'

jest.mock('../../src/models/user') // Mock the User model

describe('JWTParse Middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = {
      auth: {
        userId: '12345',
        sessionClaims: {
          __raw: 'test-raw',
          iss: 'test-iss',
          sub: 'test-sub',
          aud: 'test-aud',
          exp: 9999999999,
          nbf: 9999999999,
          iat: 9999999999,
          jti: 'test-jti',
          sid: 'test-sid',
          email: 'test@example.com'
        },
        sessionId: 'test-session-id',
        actor: undefined,
        orgId: undefined,
        orgRole: undefined,
        orgSlug: undefined,
        getToken: jest.fn(),
        orgPermissions: [],
        has: jest.fn(),
        debug: jest.fn()
      }
    }
    res = {
      sendStatus: jest.fn()
    }
    next = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call next() if user is found', async () => {
    // Mock User.findOne to return a user object
    const mockFindOne = jest.spyOn(User, 'findOne').mockResolvedValue({
      userId: '12345',
      name: 'Test User',
      email: 'test@example.com'
    })

    await JWTParse(req as Request, res as Response, next)

    expect(User.findOne).toHaveBeenCalledWith({ userId: '12345' })
    expect(User.findOne).toHaveBeenCalledTimes(1)
    expect(res.sendStatus).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()

    mockFindOne.mockRestore()
  })

  it('should send status 401 if user is not found', async () => {
    // Mock User.findOne to return null (user not found)
    const mockFindOne = jest.spyOn(User, 'findOne').mockResolvedValue(null)

    await JWTParse(req as Request, res as Response, next)

    expect(User.findOne).toHaveBeenCalledWith({ userId: '12345' })
    expect(User.findOne).toHaveBeenCalledTimes(1)
    expect(res.sendStatus).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()

    mockFindOne.mockRestore()
  })

  it('should send status 401 if an error occurs', async () => {
    // Mock User.findOne to throw an error
    const mockFindOne = jest
      .spyOn(User, 'findOne')
      .mockRejectedValue(new Error('Test error'))

    await JWTParse(req as Request, res as Response, next)

    expect(User.findOne).toHaveBeenCalledWith({ userId: '12345' })
    expect(User.findOne).toHaveBeenCalledTimes(1)
    expect(res.sendStatus).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()

    mockFindOne.mockRestore()
  })
})
