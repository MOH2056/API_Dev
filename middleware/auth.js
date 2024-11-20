import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


const auth = (req, res, next) =>{
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json('Unauthorized: User not authenticated.');
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

export default auth;