import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import 'dotenv/config'

const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

morgan.token('body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

const PORT = process.env.PORT || 3001

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
]

let lastId = persons[persons.length - 1].id

app.get('/info', (req, res) => {
  const date = new Date()
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
  )
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const { id } = req.params
  const person = persons.find((p) => p.id == id)
  if (!person) {
    return res.status(404).json({ error: 'Person dont found' })
  }
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const { id } = req.params
  persons = persons.filter((person) => person.id != id)
  res.sendStatus(204)
})

app.put('/api/persons/:id', (req, res) => {
  const { id } = req.params
  const updatePerson = req.body
  const person = persons.find((p) => p.id == id)
  if (!person) {
    return res.status(304).json({ error: 'Person dont found' })
  }
  persons = persons.map((p) =>
    p.id == id ? { ...person, number: updatePerson.number } : p
  )
  res.json({ message: 'person updated' })
})

app.post('/api/persons', (req, res) => {
  const person = req.body
  morgan.token('body', (req) => {
    return JSON.stringify(req.body)
  })
  if (!person.name || !person.number) {
    return res.status(404).json({ error: 'requires name and number' })
  }
  if (persons.some((p) => p.name.toLowerCase() === person.name.toLowerCase())) {
    return res.status(404).json({ error: 'name must be unique' })
  }
  lastId += 1
  persons = [...persons, { id: lastId, ...person }]

  res.status(201).json(person)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
