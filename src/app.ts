import config from 'config'
import express from 'express'
import connectDatabase from './utils/connect'
import logger from './utils/logger'

const app = express()
const PORT = config.get<number>('port')

app.listen(PORT, async () => {
  logger.info(`Server is running at port: ${PORT}...`);
  await connectDatabase()
}) 