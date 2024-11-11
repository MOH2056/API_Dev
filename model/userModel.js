import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'editor'], 
        default: 'user'
    }
})

const user = mongoose.model('user', userSchema)

export default user