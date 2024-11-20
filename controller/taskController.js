import task from '../model/taskModel.js'
import mongoose from 'mongoose'
import redis from 'redis'
import getRedisClient from '../redis.js'

const createTask = async (req, res)  => {
    const {title, description, dueDate} = req.body
    if (!title || !description || !dueDate ) {
        return res
        .status(400)
        .json({
            message: 'required',
            status: 'Error',
            status_code: 400
        })
    }
    try{
        const saveTask = await task({title, description, dueDate, createdBy: req.user.userId })
        await saveTask.save();
        return res
        .status(201)
        .json({
            message: 'Task created',
            status: 'success',
            status_code: 201,
            saveTask
        })
    }catch(error) {
        console.error(error.message)
        return res
        .status(500)
        .json({
            message: 'An error occurred while processing your request. Please try again later.',
            status: 'Error',
            status_code: 500       
        })

    }
}

const getAllTasks = async(req, res) => {
    const page =  parseInt(req.query.page ) || 1
    const limit = parseInt(req.query.limit ) || 5
    const skip = (page - 1)*limit
    try {
        const client = await getRedisClient()
    
        const cachedData = await client.get('tasks')

        if (cachedData) {
            console.log('Serving from Redis cache');
            return res.json({ tasks: JSON.parse(cachedData) });
        }

         const findTask = await task.find({createdBy: req.user.userId})
        .skip(skip)
        .limit(limit)
        .exec()
        await client.set('tasks', JSON.stringify(findTask), {
            EX: 3600,
        });
        if (findTask.length === 0) {
            return res.status(404).json({
                message: 'No tasks found.',
                status: 'Error',
                status_code: 404
            });
        }
        return res.status(200).json({
            message: 'Data fetched successfully',
            status: 'success',
            status_code: 200,
            Tasks: findTask
        });
    }catch(error){
        console.error(error.message)
        return res
        .status(500)
        .json({
            message:'An error occurred while fetch data. Please try again later.'
        })
    }
}
const getTask = async (req, res) => {
    try {
        const clients = await getRedisClient()
    
        const cachedtask = await clients.get('tasks:id')
        if (cachedtask) {
            console.log('Serving from Redis cache');
            return res.json({ tasks: JSON.parse(cachedtask) });
        }

        const foundtask = await task.findById(req.params.id)
        await clients.set('tasks:id', JSON.stringify(foundtask), {
            EX: 3600,
        });
        if (!foundtask) {
            return res
            .status(404)
            .json({
                message: 'No matching task found. Please verify the task ID and try again.',
                status: 'Error',
                status_code: 404
            })
        }
        return res
        .status(200)
        .json(foundtask)
    } catch(error) {
        console.error(error.message)
        return res
        .status(500)
        .json('An error occurred while processing your request. Please try again later.')
    }
}

const updateTask = async(req, res) => {
    try {
        const updatedTask = await task.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true
        })
        if(!updatedTask) {
            return res
            .status(404)
            .json({
                message: "Update failed",
                status: Error,
                status_code: 404
            })
        }
        return res
        .status(200)
        .json({
            message: 'Task updated successfully',
            status: 'Success',
            status_code: 200,
            updatedTask
        })
    } catch(error) {
        console.error(error.message)
        return res
        .status(500)
        .json('An error occurred while updating the task. Please try again later.')
    }
 }
 const deleteTask = async(req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            message: 'Invalid Task ID',
            status: 'Error',
            status_code: 400,
        });
    }
    
    try{
        const deletedTask = await task.findByIdAndDelete(req.params.id)
        if (!deletedTask) {
            return res
            .status(404)
            .json({
                message: 'Task not found. Deletion failed.',
                status: 'Error',
                status_code: 404
            })
        }
        return res
        .status(200)
        .json({
            message: 'Task deleted successfully',
            status: 'Success',
            status_code: 200,
            deletedTask
        })
    } catch(error) {
        console.error(error.message)
        return res
        .status(500)
        .json({
            message: 'An error occurred while deleting task. Please try again later.',
            status: 'Error',
            status_code: 500      
        })
    }
}
 
 export {createTask, getAllTasks, updateTask, getTask, deleteTask}