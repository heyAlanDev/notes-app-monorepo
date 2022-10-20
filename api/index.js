require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')

const Note = require('./models/Note')
const User = require('./models/User')

const notFound = require('./middleware/notFound.js')
const handleErrors = require('./middleware/handleErrors.js')
const userExtractor = require('./middleware/userExtractor')

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(cors())
app.use(express.json())
app.use(express.static('../app/build'))

// TODO: refactor de notes api

app.get('/api/notes', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  response.json(notes)
})

app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  Note.findById(id)
    .then((note) => {
      note ? response.json(note) : response.status(404).end()
    })
    .catch((err) => next(err))
})

app.put('/api/notes/:id', userExtractor, (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then((result) => {
      response.json(result)
    })
    .catch(next)
})

app.delete('/api/notes/:id', userExtractor, async (request, response, next) => {
  // const note = await Note.findById(id)
  // if (!note) return response.sendStatus(404)

  const { id } = request.params
  try {
    const res = await Note.findByIdAndDelete(id)
    if (res === null) return response.sendStatus(404)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.post('/api/notes', userExtractor, async (request, response, next) => {
  const { content, important = false } = request.body

  // sacar userId del request
  const { userId } = request

  const user = await User.findById(userId)

  if (!content) {
    return response.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user: user._id
  })

  try {
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.json(savedNote)
  } catch (error) {
    next(error)
  }
})

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
