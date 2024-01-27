const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())


let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

app.get('/api/persons',(request,response)=>{
    response.json(persons)
})

app.get('/info',(request,response)=>{
    response.send(`<p>
        Phonebook has info for ${persons.length} people
        <br/>
        ${new Date()}
    </p>`)
    
})

app.get('/api/persons/:id',(request,response)=>{
    const id = Number(request.params.id)
    const person = persons.find(note => note.id === id)

    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id',(request,response)=>{
    const id = Number(request.params.id)
    const person = persons.find(p=>p.id===id)
    persons = persons.filter(person=>person.id!==id)
    response.json(person)
})

app.post('/api/persons',(request,response)=>{
    const body = request.body

    if(!(body.number&&body.name)){
        return response.status(400).json({
            error:"name or number isn't defined"
        })
    }

    if(persons.some(person=>person.name.toLowerCase()===body.name.toLowerCase())){
        return response.status(409).json({
            error:'name already exists'
        })
    }

    const person = {
        id:Math.random()*1000,
        name:body.name,
        number:body.number,
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT||3001
app.listen(PORT)
console.log(`server running on port ${PORT}`)