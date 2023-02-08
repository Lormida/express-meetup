import express from 'express'
import cors from 'cors'
import compression from 'compression'
import HttpError from './utils/HttpError'
import { meetupRouter } from './router/meetup.router'
import cookieParser from 'cookie-parser'
import { errorMiddleware } from './middleware/error.middleware'
import { userRouter } from './router/user.router'
import deserializeUser from './middleware/deserializeUser.middleware'
import { authRouter } from './router/auth.routes'
//@ts-expect-error bug with common.js module
import helmet from 'helmet'
import swaggerDocs from './utils/swagger'

const app = express()
app.use(express.json())
app.use(deserializeUser)

app.use(cookieParser())
app.use(helmet())
app.use(
  cors({
    credentials: true,
    origin: '/',
  })
)
app.use(compression())
app.use('/auth', authRouter)
app.use('/api', userRouter)
app.use('/api', meetupRouter)

swaggerDocs(app, 3000)

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
