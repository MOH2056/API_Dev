import task from '../model/taskModel.js'
import mongoose from 'mongoose'

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
    if (!req.user || !req.user.userId) {
        return res.status(401).json({
            message: 'Unauthorized: User not authenticated.',
            status: 'Error',
            status_code: 401
        });
    }
    try{
        const saveTask = new task({title, description, dueDate, createdBy: req.user.userId })
        await saveTask.save();
        if (!saveTask) {
            return res
            .status(500)
            .json({
                message: 'Failed to save task',
                status: 'error',
                status_code: 500
            });
        }
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
        .json('An error occurred while processing your request. Please try again later.')

    }
}

const getAllTasks = async(req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit; 
    if (!req.user || !req.user.userId) {
        return res.status(401).json({
            message: 'Unauthorized: User not authenticated.',
            status: 'Error',
            status_code: 401
        });
    }
    
    try {
        const findTask = await task.find({createdBy: req.user.userId})
        .skip(skip)
        .limit(limit)
        .exec()
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
        const foundtask = await task.findById(req.params.id)
        if (!foundtask)
             return res
             .status(404)
             .json({
                 message: 'No matching task found. Please verify the task ID and try again.',
                 status: Error,
                 status_code: 404
             })
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
 
 const indexSearcher = async(req, res) => {
    try {
        const { status, dueDate, page = 1, limit = 5 } = req.query;
        const query = {};
        const skip = (page - 1) * limit;
        
        if (status) query.status = status;
        
         if (dueDate) query.dueDate = dueDate;//{
        //     const date = new Date(dueDate);
        //     if (!isNaN(date.getTime())) {
        //         query.dueDate = date;
        //     } else {
        //         return res.status(400).json({
        //             message: 'Invalid dueDate format. Please provide a valid date.',
        //             status: 'Error',
        //             status_code: 400,
        //         });
        //     }
        // }
        //console.log(query)
        const tasks = await task.find(query)
        .skip(skip)
        .limit(limit)
        if (task.length === 0) {
            return res.status(404).json({
                message: 'No tasks found.',
                status: 'Error',
                status_code: 404
            });
        }
        return res
        .status(200)
        .json({
            message: 'Found',
            status: 'Success',
            status_code: 200,
            tasks
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
}

const updateTaskStatus = async (req, res) => {
    // Array of statuses in the order of looping
    const statuses = ['pending', 'in-progress', 'complete'];

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            message: 'Invalid Task ID',
            status: 'Error',
            status_code: 400,
        });
    }

    try {
        // Find the task by ID
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
                status: 'Error',
                status_code: 404,
            });
        }

        // Determine the next status
        const currentIndex = statuses.indexOf(task.status);
        const nextIndex = (currentIndex + 1) % statuses.length; // Loop back to 0 if at the end
        const nextStatus = statuses[nextIndex];

        // Update the task's status
        task.status = nextStatus;
        await task.save();

        return res.status(200).json({
            message: `Task status updated to '${nextStatus}'`,
            status: 'Success',
            status_code: 200,
            task,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: 'An error occurred while updating the task status',
            status: 'Error',
            status_code: 500,
            error: error.message,
        });
    }
};

 export {createTask, getAllTasks, updateTask, getTask, deleteTask, indexSearcher}