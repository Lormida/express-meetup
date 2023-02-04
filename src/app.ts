import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import compression from 'compression'
import HttpError from './utils/HttpError'
import logger from './utils/logger'

// import("helmet")
// import cookieParser from 'cookie-parser'
// import helmet from 'helmet'

const app = express()
// app.use(cookieParser()
// app.use(helmet())

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// compress all responses
app.use(compression())
// app.use('/', userRouter)
// app.use('/auth', authRouter)
// app.use('/admin', adminRouter)

// Handle production
if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static(__dirname + '/public/'))
  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))
}

app.all('*', (req, _, next) => {
  next(new HttpError(`Cant find ${req.originalUrl} on this server!`, 404))
})

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.info('Error handle by bus : ', error.message, error.statusCode, error.stack)

  res.status(error.statusCode).json({
    message: error.message,
  })
})

export default app
