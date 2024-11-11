import dotenv from 'dotenv'
import user from '../model/userModel.js'
import validateEmail from '../utils/emailvalidation.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

dotenv.config()

const registerUser = async (req, res) => {
    const {email, password} = req.body
    if (!email || ! password) {
        return res
        .status(400)
        .json({
            message: 'Required',
            status: ' Error',
            status_code: 400
        })
    }
    if (!validateEmail(email)) {
        return res.status(400).json({
            message: 'Please provide a valid email address.',
            status: 'error',
            status_code: 400
        });
    }
    try{
        const existingEmail = await user.findOne({email})
        if (existingEmail) {
            return res
            .status(409) //conflict
            .json({
                message: `The email provided is already in use. Please try a different one.`,
                status: 'error',
                status_code: 409
            })
        }
        const hashedpassword = await bcrypt.hash(password, 10)
        if (!hashedpassword){
            return res
            .status(500) //conflict
            .json({
                message: `Password processing error. Please try again.`,
                status: 'error',
                status_code: 500
            })
        }
        const newUser = new user({email, "password": hashedpassword})
        await newUser.save();
        const userWithoutPassword = await user.findById(newUser._id).select('-password')
         if (!newUser) {
            return res
            .status(500) //conflict
            .json({
                message: 'Could not create user account. Please try again or reach out to support.',
                status: 'error',
                status_code: 500
            })
         } 
        return res
        .status(201) 
        .json({
            message: 'Welcome! Your account has been created successfully.',
            status: 'success',
            status_code: 201,
            details: userWithoutPassword
        })
    }catch(error) {
        console.error(error.message)
        return res
        .status(500)
        .json('An error occurred while processing your request. Please try again later.')
    }
}

const loginUser = async(req, res) => {
    const {email, password} = req.body
    const  checkIfEmailExist = await user.findOne({email}) 
    if(!checkIfEmailExist) {
        return res
        .status(401)
        .json({
            message: 'The email you entered is incorrect',
            status: 'error',
            status_code: 401
        })
    }
    const comparePassword = await bcrypt.compare(password, checkIfEmailExist.password)
    if(!comparePassword) {
        return res
        .status(401)
        .json({
            message: 'The paassword you entered is incorrect',
            status: 'error',
            status_code: 401
        })
    }
    const withoutPassword = await user.findById(checkIfEmailExist._id).select('-password')
    const payload = {
        useremail: checkIfEmailExist.email,
        userId: checkIfEmailExist.id,
        userrole: checkIfEmailExist.role
    }
    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, {expiresIn: '1h'})
    return res
    .status(200)
    .json({
        message: 'user logged in successfully',
        status: 'success',
        status_code: 200,
        accessToken,
        newDetails: withoutPassword
    })

} 

    export { registerUser, loginUser }