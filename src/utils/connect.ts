import mongoose from 'mongoose'
import config from 'config'

async function connectDatabase() {
  const dbURI = config.get<string>("dbURI")
  try {
    await mongoose.connect(dbURI)
    console.log('DB connection successful...')
     
  } catch(e){
    console.error('Failure during connection to database',e)
    process.exit(1)
  }
}

export default connectDatabase 