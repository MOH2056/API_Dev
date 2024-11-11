import express from 'express'
import auth from '../middleware/auth.js'
import authorization from '../middleware/authorization.js'
import { createTask } from '../controller/taskController.js'

const route = express.Router()

route.post('/tasks', auth, authorization(), createTask)

export default route