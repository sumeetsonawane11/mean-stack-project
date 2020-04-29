// This acts as an interceptor to check wether the token is valid or not
// If valid , continue the request journey otherwise reject it

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];// Extract the token from authorization headers
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = { email: decodedToken.email, userId : decodedToken.userId };
        next();
    }catch(err){
        res.status(401).json({
            message : 'You are not authenticated'
        })
    }
}