import mongoose from 'mongoose'
import Person from '../models/person.js'
import process from 'process'

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://rimRasen:${password}@nodeexpressprojects.umpshdn.mongodb.net/fullstackopen?retryWrites=true&w=majority`

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')

    if (process.argv.length === 3) {
      // If only password is provided, list all entries
      return Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        return mongoose.connection.close()
      })
    } else if (process.argv.length === 5) {
      // If name and number are provided, add new entry
      const name = process.argv[3]
      const number = process.argv[4]
    
      const person = new Person({
        name: name,
        number: number
      })

      return person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`)
        return mongoose.connection.close()
      })
    } else {
      console.log('Please provide both name and number as arguments: node mongo.js <password> <name> <number>')
      return mongoose.connection.close()
    }
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
    process.exit(1)
  })