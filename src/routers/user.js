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

// Read users - middleware must always be the 2nd argument and the handlerfunction must be the 3rd.
router.get('/users/user', authentication ,async (req, res) => {
    res.send(req.user)
})

// Read single user
router.get('/users/:id', async (req, res) => {
    //use Express' 'req.params' to access the dynamic '/:id' value
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) return res.status(404).send()

        res.send(user)
    } catch(error) {
        res.status(500).send(error)
    }
})

// Update user
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) return res.status(400).send({ error: 'Invalid update' })
    
    try {
        const user = await User.findById(req.params.id)

        // Loop through the request body object and update the values to what the user inputs.
        updates.forEach((update) => {
            user[update] = req.body[update]
        })
        await user.save()
       
        if (!user) return res.status(404).send()

        res.send(user)
    } catch(error) {
        console.log("ERROR")
        res.status(400).send(error)
    }
})

// Delete single user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) return res.status(404).send()

        res.send(user)
    } catch(error) {
        res.status(500).send()
    }
})

module.exports = router