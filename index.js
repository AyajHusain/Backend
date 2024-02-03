require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))



app.get('/api/persons',(request,response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info',(request,response) => {
    Person.find({})
        .then(persons =>  response.send(`<p>
        Phonebook has info for ${persons.length} people
        <br/>
        ${new Date()}
    </p>`))
})


app.get('/api/persons/:id',(request,response,next) => {
    Person.findById(request.params.id)
        .then(person => {
            if(person){
                response.json(person)
            }
            else{
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})


app.delete('/api/persons/:id',(request,response,next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.json(result)
        })
        .catch(error => next(error))
})


app.post('/api/persons',(request,response,next) => {
    const body = request.body

    const person = new Person({
        name:body.name,
        number:body.number
    })

    person.save()
        .then(newPerson => {
            response.json(newPerson)
        })
        .catch(error => next(error))
})


app.put('/api/persons/:id',(request,response,next) => {
    const { name,number } = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        { name,number },
        { new:true,runValidators:true,context:'query' })
        .then(updatePerson => {
            response.json(updatePerson)
        })
        .catch(error => next(error))
})


const errorHandler = (error,request,response,next) => {
    console.log(error.message)

    if(error.name==='CastError'){
        response.status(400).json({ error:'malformed id' })
    }

    else if(error.name==='ValidationError'){
        response.status(400).json({ error:error.message })
    }
    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT)
console.log(`server running on port ${PORT}`)