import jwt from 'jsonwebtoken'
//import user from '../model/userModel.js'
import dotenv from 'dotenv'
dotenv.config()


const auth = (req, res, next) =>{
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);
  console.log(authHeader);
  const token = authHeader.split(' ')[1];
  jwt.verify (
    token,
    process.env.ACCESS_SECRET,
    (err, decoded) => {
      if (err) return res.status(403);
      req.user = decoded.useremail
      next();
    }
  )
}

// const auth = async(req, res, next) => {
//   const token = req.header('Authorization')?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
//     const User = await user.findOne({
//       _id: decoded._id
//     }) 
//     if (!User)
//       throw new Error ('Unable to login')
//     req.User = User
//     req.token = token
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };


export default auth;