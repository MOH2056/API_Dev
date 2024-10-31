import mongoose from "mongoose"

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
     },
    description: {
        type: String
    },
    dueDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'In progress', 'completed'],
        default: 'pending'
    }
 }, { timestamps: true
})


const task = mongoose.model('task', taskSchema)

export default task
