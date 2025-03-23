import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import process from 'process';
import mongoose from 'mongoose';

if (process.argv.length < 3) { 
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const db_password = process.argv[2]
const url = `mongodb+srv://rimRasen:${db_password}@nodeexpressprojects.umpshdn.mongodb.net/fullstackopen?retryWrites=true&w=majority&appName=NodeExpressProjects`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
name: String,
number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // list all entries
  Person.find({}).then(result => {
  console.log('phonebook:')  
  result.forEach(person => {
      console.log(person)
  })
  mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  // new entry
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({
      name: name,
      number: number
  })
  person.save().then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
  })
} else { 
  console.log('Please provide the password, name and number as arguments: node mongo.js <password> <name> <number>')
  process.exit(1)
}

const app = express();

app.use(express.json());
app.use(express.static('dist'));
app.use(morgan('tiny'));
app.use(cors());

morgan.token('body', (req) => {
  if (req.method === 'POST') { 
    return JSON.stringify(req.body);
  }
  return ' ';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));



app.get('/api/persons', (req, res) => {
  Person.find({}).then(result => {
      res.json(result);
  });
});

app.get('/api/persons/:id', (req, res) => { 
  Person.findById(req.params.id).then(person => {
      if (person) {
          res.json(person);
      } else {
          res.status(404).end();
      }
  });
});

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id).then(() => {
      res.status(204).end();
  });
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
      return res.status(400).json({
          error: 'The name or number missing'
      });
  }

  const person = new Person({
      name: body.name,
      number: body.number
  });

  person.save().then(savedPerson => {
      res.json(savedPerson);
  });
});

app.get('/info', (req, res) => {
  Person.countDocuments({}).then(count => {
      const info = `
      <p>Phonebook has info for ${count} people</p>
      <p>${new Date()}</p>
      `;
      res.send(info);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => { 
  console.log(`Server running on port ${PORT}`);
});
