/* eslint-disable @typescript-eslint/no-namespace */
import express, { Request, Response } from 'express'
import 'dotenv/config'
import cors from 'cors'
import userRouter from './routes/userRouter'
import mongoose from 'mongoose'
import {
  ClerkExpressWithAuth,
  LooseAuthProp,
  StrictAuthProp,
  WithAuthProp
} from '@clerk/clerk-sdk-node'
// import { job } from './data/collector'
import stockRouter from './routes/stockRouter'
import watchlistRouter from './routes/watchlistRouter'

const app = express()
const port = 3000
declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
    interface Request extends LooseAuthProp {}
  }
}

app.use(cors())
app.use(express.json())
app.use('/api/user', userRouter)
app.use('/api/stocks', stockRouter)
app.use('/api/watchlist', watchlistRouter)

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log('Connet to mongodb')
})

// job.start()

app.get('/test', (req: Request, res: Response) => res.send('Hello World!'))
app.get(
  '/test1',
  ClerkExpressWithAuth(),
  (req: WithAuthProp<Request>, res: Response) => {
    res.json(req.auth)
  }
)

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
)

export { app, server }
