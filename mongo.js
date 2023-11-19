const mongoose = require('mongoose')

const password = encodeURIComponent(`${process.argv[2]}`)
const url = `mongodb+srv://rli12138:${password}@fullstackopen.qapvnqp.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})


const Person = new mongoose.model('person',personSchema)

if (process.argv.length===3){
    console.log('Phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
}

else if (process.argv.length==5){
    const person = new Person ({
        name: `${process.argv[3]}`,
        number: `${process.argv[4]}`,
      })
    
    person.save().then(result => {
        console.log(`added ${person.name} Number ${person.number} to phonebook`)
        mongoose.connection.close()
      })
    
}

else {
    console.log('Please enter password name number or password only')
}