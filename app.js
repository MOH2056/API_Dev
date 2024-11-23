import dotenv from 'dotenv'
import express from 'express'
import connectDB from './db.js'
import router from './routes/authRoute.js'
import route from './routes/taskRoute.js'
import { errorHandler } from './middleware/errorHandler.js'
import morgan from 'morgan'

dotenv.config

const app = express()
const PORT = process.env.PORT || 4000

connectDB();

app.use(morgan('tiny'))

app.use(express.json())

app.use('/', router)
app.use('/', route)

app.use(errorHandler)

app.listen(PORT, (req, res) => {
    console.log(`server is running on ${PORT}....`)
})