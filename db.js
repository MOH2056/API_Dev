import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_uri);
        console.log('Database connected');
    } catch (err) {
        console.error('Database connection error: ', err);
        process.exit(1);
    }
};

export default connectDB;