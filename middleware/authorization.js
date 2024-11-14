import jwt from 'jsonwebtoken'

const authorization = (requiredRole) => (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).send('Authorization header is missing.');
    }
    console.log(authHeader);
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send('Token missing in authorization header.');
    }
    jwt.verify (token, process.env.ACCESS_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send('Invalid or expired token.');
        }
        if (!decoded.userrole) {
            return res.status(401).send('Unauthorized access. Role is missing.');
        }
        if (decoded.userrole !== requiredRole) {
        return res
            .status(403)
            .send('Access denied: You do not have the required permissions to perform this action.');
        }
        req.user = decoded;
        next();
    });
};

export default authorization;
