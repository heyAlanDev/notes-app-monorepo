const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const { server } = require('../index')
const User = require('../models/User')
const { api, getUsers } = require('./helpers')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('pswd', 10)

  const user = new User({
    username: 'alanroot',
    passwordHash
  })
  await user.save()
})

describe('GET all users', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are same users in the backend and DB', async () => {
    const users = await getUsers()
    const response = await api.get('/api/users')

    expect(response.body).toHaveLength(users.length)
  })

  test('the first user is a root', async () => {
    const users = await getUsers()
    const usersnames = users.map((u) => u.username)
    expect(usersnames).toContain('alanroot')
  })
})

describe('creating a new user', () => {
  test('works as expected creating a fresh username', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'hiAlanDev',
      name: 'alan',
      password: 'modoinsano'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usersnames = usersAtEnd.map((u) => u.username)
    expect(usersnames).toContain(newUser.username)
  })

  test('creation fails with propers statuscode and message if username is already taken', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'alanroot',
      name: 'Alan',
      password: 'modohacker'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toContain('`username` to be unique')

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
