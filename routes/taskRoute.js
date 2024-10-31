import express from 'express'
import auth from '../middleware/auth.js'
import { createTask } from '../controller/taskController.js'

const route = express.Router()

route.post('/tasks', auth, createTask)

export default route