import task from '../model/taskModel.js'
import mongoose from 'mongoose'
import redis from 'redis'
import getRedisClient from '../redis.js'
import { BadRequestError, NotFoundError } from '../middleware/errorHandler.js'
import sendResponse from '../utils/responseHandler.js'

const createTask = async (req, res, next) => {
    const { title, description, dueDate } = req.body;

    if (!title || !description || !dueDate) {
        return next(new BadRequestError('All fields (title, description, dueDate) are required.'));
    }

    try {
        const saveTask = new task({
            title,
            description,
            dueDate,
            createdBy: req.user.userId,
        });

        await saveTask.save();

        sendResponse(res, {
            message: 'Task created successfully.',
            statusCode: 201,
            data: saveTask,
        });
    } catch (error) {
        if (!(error instanceof CustomError)) {
            error = new CustomError('An error occurred while creating the task.', 500);
        }

        next(error);
    }
};



const getAllTasks = async(req, res, next) => {
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
            return next(new NotFoundError('Task not found.'));
        }
        sendResponse(res, {message: 'Task found.', status_code: 200, data: findTask})
    }catch(error){
        console.error(error.message)
        next(error)
    }
}
const getTask = async (req, res, next) => {
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
            return next (new NotFoundError('Task not found.'));
        }
       
        sendResponse(res, {message: 'Task found.', status_code: 200, data: foundtask})
    } catch(error) {
        console.error(error.message)
        next(error);
    }
}

const updateTask = async(req, res, next) => {
    try {
        const updatedTask = await task.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true
        })
        if(!updatedTask) {
           return next( new NotFoundError('Not updated.'));
        }
        sendResponse(res, {message: 'Task updated successfully', status_code: 200, data: updatedTask})
    } catch(error) {
        console.error(error.message)
        next(error);
    }
 }
 const deleteTask = async(req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw new BadRequestError()
    }
    
    try{
        const deletedTask = await task.findByIdAndDelete(req.params.id)
        if (!deletedTask) {
            return next(new NotFoundError('Task not deleted.'));
        }
        sendResponse(res, {
            message: 'Task deleted successfully',
            data: { deletedTask }
        });
        
    } catch(error) {
        console.error(error.message)
        next(error);
    }
}
 
 export {createTask, getAllTasks, updateTask, getTask, deleteTask}