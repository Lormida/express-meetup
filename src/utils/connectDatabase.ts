import mongoose from 'mongoose'
import config from 'config'
import logger from './logger'


async function connectDatabase() {
  const dbURI = config.get<string>("dbURI")
  try {
    await mongoose.connect(dbURI)
    logger.info('DB connection successful...')
     
  } catch(e){
    logger.error('Failure during connection to database',e)
    process.exit(1)
  }
}

export default connectDatabase 