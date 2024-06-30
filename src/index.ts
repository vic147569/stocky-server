/* eslint-disable @typescript-eslint/no-namespace */
import express, { Request, Response } from 'express'
import 'dotenv/config'
import cors from 'cors'
import userRouter from './routes/userRouter'
import mongoose from 'mongoose'
import { StrictAuthProp } from '@clerk/clerk-sdk-node'
// import { job } from './data/collector'
import stockRouter from './routes/stockRouter'
import watchlistRouter from './routes/watchListRouter'

const app = express()
const port = 3000
declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
