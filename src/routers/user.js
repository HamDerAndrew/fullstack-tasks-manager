const express = require('express');
const router = new express.Router();
const authentication = require('../middleware/authentication');
const User = require('../models/user');

// Create user
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user: user, token: token})
    } catch(error) {
        res.status(400).send(error)
    }
})

// Login users
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user: user, token: token})
    } catch(error) {
        res.status(400).send()
    }
})

// Logout user from single session
router.post('/users/logout', authentication, async (req, res) => {
    try {
        // Filter out/delete the token when the user logs out.
        req.user.tokens = req.user.tokens.filter((token) => {
            // If the token matches, keep it in the array. If not, remove it
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch(error) {
        res.status(500).send()
    }
})

// Logout user from all sessions (ex. mobile, smartTV, desktop etc.)
router.post('/users/logoutall', authentication, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch(error) {
        res.status(500).send()
    }
})

// Read user - middleware must always be the 2nd argument and the handlerfunction must be the 3rd.
router.get('/users/user', authentication ,async (req, res) => {
    res.send(req.user)
})

// Update user
router.patch('/users/user', authentication, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) return res.status(400).send({ error: 'Invalid update' })
    
    try {
        // Loop through the request body object and update the values to what the user inputs.
        updates.forEach((update) => {
            // Remember, we have access to 'user' in 'req' because of the 'authentication'
            req.user[update] = req.body[update]
        })
        await req.user.save()

        res.send(req.user)
    } catch(error) {
        res.status(400).send(error)
    }
})

// Delete user
router.delete('/users/user', authentication, async (req, res) => {
    try {
        // We have access to 'req.user' because of the 'authentication' middleware
        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user) return res.status(404).send()

        // Use Mongoose 'remove()' to delete the user
        await req.user.remove()

        res.send(req.user)
    } catch(error) {
        res.status(500).send()
    }
})

module.exports = router