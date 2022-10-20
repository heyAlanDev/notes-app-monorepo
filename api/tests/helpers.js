const { app } = require('../index')
const supertest = require('supertest')
const User = require('../models/User')
const api = supertest(app)

const initialNotes = [
  {
    content: 'whassaaaaaap!!🐱‍👓🐱‍💻',
    date: new Date(),
    important: true
  },
  {
    content: 'put again note',
    date: new Date(),
    important: false
  },
  {
    content: 'the test are amazing!! a can refactor',
    date: new Date(),
    important: true
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map((note) => note.content),
    response
  }
}

const getUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map((user) => user.toJSON())
}

module.exports = {
  api,
  initialNotes,
  getAllContentFromNotes,
  getUsers
}
