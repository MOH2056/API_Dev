import mongoose from "mongoose"

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
     },
    description: {
        type: String
    },
    dueDate: {
        type: Date,
        default: new Date()
    },
    status: {
        type: String,
        enum: ['pending', 'In progress', 'completed'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    }, 
}, { timestamps: true
})

taskSchema.index({status: 1, dueDate: 1, title: 1})

const task = mongoose.model('task', taskSchema)

export default task
