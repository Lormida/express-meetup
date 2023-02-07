import config from 'config'
import connectDatabase from './utils/connectDatabase'
import logger from './utils/logger'
import app from './app'

const PORT = config.get<number>('port') || 3000

const server = app.listen(PORT, async () => {
  logger.info(`Server is running at port: ${PORT}...`)
  await connectDatabase()
})

/**
 * Handling critical error events
 */
process.on('unhandledRejection', (err: Error) => {
  logger.error({ name: err.name, message: err.message }, 'UNHANDLED REJECTION! 💥 Shutting down...')
  server.close(() => {
    process.exit(1)
  })
})

process.on('SIGTERM', () => {
  logger.error('SIGTERM RECEIVED. Shutting down gracefully...')
  server.close(() => {
    logger.error('Process terminated...')
  })
})
