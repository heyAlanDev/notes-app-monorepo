const bcrypt = require('bcrypt')
const usersRoter = require('express').Router()
const User = require('../models/User')

usersRoter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', { content: 1, date: 1 })
  response.json(users)
})

usersRoter.post('/', async (request, response, next) => {
  const { body } = request
  const { username, name, password } = body

  const saltRound = 10
  const passwordHash = await bcrypt.hash(password, saltRound)

  const user = new User({
    username,
    name,
    passwordHash
  })

  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    console.log(error)
    response.status(400).json({ error: error.message })
  }
})

module.exports = usersRoter
