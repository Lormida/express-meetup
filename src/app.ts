import express from 'express'
import cors from 'cors'
import compression from 'compression'
import HttpError from './utils/HttpError'
import { meetupRouter } from './router/meetup.router'
import cookieParser from 'cookie-parser'
import config from 'config'
import { errorMiddleware } from './middleware/error.middleware'
import { userRouter } from './router/user.router'

// import("helmet")
// import cookieParser from 'cookie-parser'
// import helmet from 'helmet'

const app = express()
app.use(express.json())
app.use(cookieParser())
// app.use(helmet())
app.use(
  cors({
    credentials: true,
    origin: config.get<string>('CLIENT_URL'),
  })
)
app.use(compression())
app.use('/api', meetupRouter)
app.use('/', userRouter)

// Handle production
if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static(__dirname + '/public/'))
  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))
}

app.all('*', (req, _, next) => {
  next(new HttpError(404, `Cant find ${req.originalUrl} on this server!`))
})

app.use(errorMiddleware)
export default app
