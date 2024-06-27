/* eslint-disable @typescript-eslint/no-namespace */
import express, { Request, Response } from 'express'
import 'dotenv/config'
import cors from 'cors'
import userRouter from './routes/userRouter'
import mongoose from 'mongoose'
import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
  StrictAuthProp
} from '@clerk/clerk-sdk-node'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}

app.use('/api/user', userRouter)

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log('Connet to mongodb')
})

app.get('/test', (req: Request, res: Response) => res.send('Hello World!'))

app.get(
  '/test1',
  ClerkExpressRequireAuth(),
  (req: RequireAuthProp<Request>, res: Response) => {
    res.json(req.auth)
  }
)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
