import config from 'config'
import express from 'express'
import connectDatabase from './utils/connect'

const app = express()
const PORT = config.get<number>('port')

app.listen(PORT, async () => {
  console.log(`Server is running at port: ${PORT}...`);
  await connectDatabase()
}) 