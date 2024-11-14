import express from 'express'
import auth from '../middleware/auth.js'
import authorization from '../middleware/authorization.js'
import { createTask, getAllTasks, updateTask, getTask, deleteTask, indexSearcher } from '../controller/taskController.js'

const route = express.Router()

route.post('/tasks', auth, authorization('user'), createTask)
route.get('/tasks', auth, authorization ('user'), getAllTasks)
route.get('/tasks/:id', auth, authorization ('user'), getTask)
route.put('/tasks/:id', auth, authorization ('user'), updateTask)
route.delete('/tasks/:id', auth, authorization ('user'), deleteTask)
route.get('/task', auth, authorization ('user'), indexSearcher)
export default route