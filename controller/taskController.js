import task from '../model/taskModel.js'


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
        const saveTask = new task({title, description, dueDate })
        await saveTask.save()
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
    try{
        const findTask = await task.find({})
        if (!findTask) 
            return res
        .status(404)
        .json({
            message: 'No tasks found',
            status: Error,
            status_code: 404 
        })
        return res
        .s
    }catch(error){}
}
 const getTask = async (req, res) => {
    const user = await task.findById(req.params.id)

 }
 const updateTask = () => {
    
 }
 const deleteTask = () => {
    
 }

 export {createTask}