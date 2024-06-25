import express, { Request, Response } from 'express'
import 'dotenv/config'
import cors from 'cors'
import userRouter from './routes/userRouter'
import mongoose from 'mongoose'
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use('/api/user', userRouter)

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log('Connet to mongodb')
})

app.get('/test', (req: Request, res: Response) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
