require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons')

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
morgan.token('body', req => {
    return JSON.stringify(req.body)
  })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



app.get('/api/persons', (request, response) => {
    Person.find().then(persons => {response.json(persons)})
  })

app.get('/info',(request,response)=>{
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
                    <br/>
                    <p>${Date()}</p>`)
})

app.get('/api/persons/:id',(request,response)=>{
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id',(request,response)=>{
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const generateId =()=>{
    return Math.floor(Math.random() * 100000)
}

app.post('/api/persons',(request,response)=>{
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({ 
        error: 'entry must include a name and a number' })
    }
    else if(persons.find(person =>person.name === body.name)){
        return response.status(400).json({ 
            error: 'name must be unique' })
    }
    const person ={
        id: generateId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(persons)
})



const PORT = process.env.PORT || 3001
app.listen(PORT,()=> {
    console.log(`server running on port ${PORT}`)
})

