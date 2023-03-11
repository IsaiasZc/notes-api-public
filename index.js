const express = require('express')
const cors = require('cors')

const app = express()
const logger = require('./loggerMiddleware')

app.use(cors())
// recupera json parser
app.use(express.json())

app.use(logger)

let notes = [
  {
    id: 1,
    content: 'Me tengo que suscribir a @midudev en YouTube',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Tengo que estudiar las clases de FullStack Bootcamp',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'Repasas los retos JS de midudev',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

// const app = http.createServer((req, res) => { // Creamos el servidor
//   res.writeHead(200, {'Content-Type': 'application/json'}); // Escribimos la cabecera
//   res.end(JSON.stringify(notas)); // Enviamos la respuesta
// });

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)

  console.log({ id })

  const note = notes.find((note) => note.id === id) // Aqui puede darnos error si no validamos incluso el tipo de dato, recuerda que
  // la request nos está devolviendo un string y en nuestras notas el id es number

  console.log({ note })

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter((note) => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body
  const ids = notes.map((note) => note.id)
  const maxId = Math.max(...ids)

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false
  }

  notes = [...notes, newNote]

  response.json(newNote)
})

app.use((request, response) => {
  console.log(request.path)
  response.status(404).json({
    error: 'Not found '
  })
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
