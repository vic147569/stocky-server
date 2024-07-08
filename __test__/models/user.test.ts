import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import User from '../../src/models/user'

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

afterEach(async () => {
  await User.deleteMany({})
})

describe('User Model Test', () => {
  it('should create and save a user record successfully', async () => {
    const validUser = new User({
      userId: '12345',
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '123-456-7890'
    })
    const savedUser = await validUser.save()

    expect(savedUser._id).toBeDefined()
    expect(savedUser.userId).toBe(validUser.userId)
    expect(savedUser.name).toBe(validUser.name)
    expect(savedUser.email).toBe(validUser.email)
    expect(savedUser.phone).toBe(validUser.phone)
  })

  it('should fail to create a user record without required fields', async () => {
    const invalidUser = new User({
      name: 'John Doe'
    })

    let err
    try {
      await invalidUser.save()
    } catch (error) {
      err = error
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
    // expect(err.errors.userId).toBeDefined()
    // expect(err.errors.email).toBeDefined()
  })

  it('should create a user record without a phone number', async () => {
    const validUser = new User({
      userId: '12345',
      name: 'John Doe',
      email: 'johndoe@example.com'
    })
    const savedUser = await validUser.save()

    expect(savedUser._id).toBeDefined()
    expect(savedUser.userId).toBe(validUser.userId)
    expect(savedUser.name).toBe(validUser.name)
    expect(savedUser.email).toBe(validUser.email)
    expect(savedUser.phone).toBeUndefined()
  })
})
