import mongoose from 'mongoose'
import config from 'config'
import logger from './logger'

async function connectDatabase() {
  const dbURI = config.get<string>('dbURI')
  try {
    await mongoose.connect(dbURI)
    logger.info('DB connection successful...')
  } catch (err) {
    logger.error(err, 'Failure during connection to database')
    process.exit(1)
  }
}

export default connectDatabase
