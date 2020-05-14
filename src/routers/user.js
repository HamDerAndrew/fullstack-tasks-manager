const express = require('express');
const router = new express.Router()
const User = require('../models/user');

// Create users
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save()
        res.status(201).send(user)
    } catch(error) {
        res.status(400).send(error)
    }
})

// Login users
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        res.send(user)
    } catch(error) {
        res.status(400).send()
    }
})

// Read users
router.get('/users', async (req, res) => {
    try {
        // Using an empty object with .find() fetches all users
        const users = await User.find({})
        res.send(users)
    } catch(error) {
        res.status(500).send()
    }
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