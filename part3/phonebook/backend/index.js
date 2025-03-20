import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import process from 'process';

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

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons);
})

app.get('/api/persons/:id', (req, res) => { 
  const id = req.params.id;
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const personToDelete = persons.find(person => person.id === id);

  if (personToDelete) {
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
  } else { 
    res.status(404).end();
  }
})

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'The name or number missing'
    });
  }
  if (persons.find(person => person.name === body.name)) {
    return res.status(400).json({
      error: 'The name already exists in the phonebook'
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: String(Math.floor(Math.random() * 5000))
  };

  persons = persons.concat(person);
  res.json(person);
})

app.get('/info', (req, res) => {
  const info = `
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>
  `;

  res.send(info);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => { 
    console.log(`Server running on port ${PORT}`);
})
