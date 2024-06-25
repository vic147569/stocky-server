import mongoose from 'mongoose'
// import { ObjectId } from 'mongodb'

const userSchema = new mongoose.Schema({
  // _id: ObjectId,
  userId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
})

const User = mongoose.model('User', userSchema)

export default User
