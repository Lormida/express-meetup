import config from 'config'
import connectDatabase from './utils/connectDatabase'
import logger from './utils/logger'
import app from './app'

const PORT = config.get<number>('port')

const server = app.listen(PORT, async () => {
  logger.info(`Server is running at port: ${PORT}...`);
  await connectDatabase()
}) 

/**
 * Handling critical error events
 */
process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully...')
  server.close(() => {
    console.log('Process terminated...')
  })
})
