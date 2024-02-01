const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

console.log("connecting to", url)

mongoose.connect(url)
    .then(result=>{
        console.log('connected to MONGODB')
    })
    .catch(error=>{
        console.log('error connecting to MONGODB',error.message)
    })

const isValidPhoneNumber = (value) =>{
    const phoneNumberPattern = /^\d{2,3}-\d+$/
    return phoneNumberPattern.test(value)
}

const personSchema = new mongoose.Schema({
    name:{
        type:String,
        minLength:3,
        required:true
    },
    number:{
        type:String,
        minLength:8,
        validate:{
            validator:isValidPhoneNumber,
            message:'The value does not meet validation criteria'
        }
    }
})

personSchema.set('toJSON',{
    transform:(document,requestedObj)=>{
        requestedObj.id = requestedObj._id
        delete requestedObj._id
        delete requestedObj.__v
    }
})

module.exports = mongoose.model('Person',personSchema)
