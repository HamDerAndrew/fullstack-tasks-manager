const jwt = require('jsonwebtoken');
const User = require('../models/user')

const authentication = async (req, res, next) => {
    try {
        // Use replace to get the 'clean' token by removing 'Bearer'
        const token = req.header('Authorization').replace('Bearer ', '')
        // Verify the token with the secret
        const decoded = jwt.verify(token, 'thisisasecretnode')
        // Find the user. Look for a user with a valid token in their 'tokens' array
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) throw new Error()

        // Add the property 'token' to the request.
        req.token = token
        // Add the property 'user' to the request and store the user in it
        req.user = user
        next()
    } catch(error) {
        res.status(401).send({error: 'Invalid authentication'})
    }
}

module.exports = authentication