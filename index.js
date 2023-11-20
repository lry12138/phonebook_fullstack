require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
morgan.token('body', req => {
    return JSON.stringify(req.body)
  })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
    Person.find().then(persons => {response.json(persons)})
  })


app.get('/info',(request,response)=>{
    Person.count({}).then(number =>{
      response.send(`<p>Phonebook has info for ${number} people</p>
      <br/>
      <p>${Date()}</p>`)})
    
})

app.get('/api/persons/:id',(request,response,next)=>{
  Person.findById(request.params.id).then(person => {
    if (person){
      response.json(person)
    }
    else{
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id',(request,response,next)=>{
    Person.findByIdAndDelete(request.params.id).then(
      result => {response.status(204).end()
      })
      .catch(error => next(error))
})



app.post('/api/persons',(request,response,next)=>{
    const body = request.body
    if (!body.name || !body.number) {
      return response.status(400).json({ 
      error: 'entry must include a name and a number' })
  }

    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson =>{response.json(savedPerson)})
    .catch(error =>{next(error)})
    
})

app.put('/api/persons/:id',(request,response,next)=>{
  const {name,number} = request.body

  Person.findByIdAndUpdate(request.params.id, 
    {name,number},
    {new: true, runValidators:true, context: 'query' })
  .then(updatedPerson =>{
    response.json(updatedPerson)
  })
  .catch(error =>{next(error)})
})

const errorHandler = (error,request,response,next) =>{
  console.error(error.message)
  if (error.name === 'CastError'){
    return response.status(400).send({error: 'malformatted ID'})
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }


  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT,()=> {
    console.log(`server running on port ${PORT}`)
})

