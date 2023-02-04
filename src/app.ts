import dotenv from 'dotenv'
import express, { Request, Response } from 'express'


dotenv.config()
const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())

app.get('/home', (req, res) => {
  return res.send('Home data')
})

app.route('/')
  .get((req: Request, res: Response) => {
    return res.send('Yo')
  })
  .post((req: Request,res: Response) => {

    console.log(req.body)

    return res.json(req.body)
  })  


app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);

}) 