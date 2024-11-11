const authorization = (requiredRole) => (req, res, next) => {
    if (req.user.role) return res.status(401).send('Unauthorized access');

    if (req.user.role !== requiredRole) {
        return res.status(403).send('Access denied: You do not have the required permissions to perform this action.');
    }
    next();
}
