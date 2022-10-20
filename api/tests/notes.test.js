const mongoose = require('mongoose')

const { server } = require('../index')
const Note = require('../models/Note')
const { api, initialNotes, getAllContentFromNotes } = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})
  // paralelo
  // const notesObjects = initialNotes.map((note) => new Note(note))
  // const promises = notesObjects.map((note) => note.save())
  // await Promise.all(promises)

  // secuencial
  for (const note of initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})

describe('GET all notes', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are same notes in the backend and DB', async () => {
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('the first note is a greeting', async () => {
    const { contents } = await getAllContentFromNotes()

    expect(contents).toContain('whassaaaaaap!!🐱‍👓🐱‍💻')
  })
})

describe('create a note', () => {
  test('is possible with a valid note', async () => {
    const newNote = {
      content: 'Proximamente async/await',
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { contents, response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain(newNote.content)
  })

  test('is not possible with an invalid note', async () => {
    const newNote = {
      important: true
    }

    await api.post('/api/notes').send(newNote).expect(400)

    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('delete a note', () => {
  test('all work fine cuz the note exist', async () => {
    const { response: firstResponse } = await getAllContentFromNotes()
    const { body: notes } = firstResponse
    const noteToDelete = notes[0]

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

    const { contents, response: secondResponse } =
      await getAllContentFromNotes()

    expect(secondResponse.body).toHaveLength(initialNotes.length - 1)

    expect(contents).not.toContain(noteToDelete.content)
  })

  test('do not work cuz the note does not exist and invalid id', async () => {
    await api.delete('/api/notes/1234').expect(400)

    const { response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('do not work cuz the note does not exist and valid id', async () => {
    await api.delete('/api/notes/60451827152dc22ad768f442').expect(404)

    const { response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
