import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import process from 'process';
import 'dotenv/config'


const url = process.env.MONGODB_URI
console.log('Connecting to:', url)

mongoose.connect(url)
  .then(() => { 
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

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