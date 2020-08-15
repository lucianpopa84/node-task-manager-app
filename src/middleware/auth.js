const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        // const token = req.header('Authorization').replace('Bearer ', '');
        const token = req.signedCookies.session.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw new Error();
        }

        req.user = user; // save user for next callback function
        req.token = token; // save token for next callback function
        next();

    } catch (error) {
        // res.status(401).send({ error: 'Please authenticate.'});
        res.redirect('/users/login');
    }
}

module.exports = auth;