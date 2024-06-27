import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  // _id: ObjectId,
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  }
})

const User = mongoose.model('User', userSchema)

export default User
