const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

morgan.token('content', (request, response) => {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Dan Abramov",
    number: "703-863-9393",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  },
  {
    name: "Mason Valentine",
    number: "703-829-1717",
    id: 7
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (!person) {
    response.status(404).end()
  }

  response.json(person)
})

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 1000)
}

app.post('/api/persons/', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }
  else if (persons.map(p => p.name).includes(body.name)) {
    return response.status(400).json({
      error: 'entry already exists'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  
  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// {
//   name: "Dan Abramov",
//   number: "703-863-9393",
//   id: 3
// }