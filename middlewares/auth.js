const jwt = require('jsonwebtoken');
const User = require('../models/user');

const verifyToken = async (req, res, next) => {
    const bearerToken = req.header('authorization');
    if (!bearerToken) {
        return res.status(401).json({
            status: false,
            message:
                'Access Denied, You need to sign in first to get the token',
        });
    }
    const token = bearerToken.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        req.userId = decodedToken.id;
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({
                status: false,
                message: 'Unauthorized, You are not authorized user',
            });
        }
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = verifyToken;
