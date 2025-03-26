import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import process from 'process';
import 'dotenv/config';
import Person from '../models/person.js';
import mongoose from 'mongoose';

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)
 .then(() => {
   console.log('connected to MongoDB');
 })
 .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
 });
 
const app = express();

app.use(express.json());
app.use(express.static('dist'));
app.use(cors());

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ' ';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(people => {
      res.json(people);
    })
    .catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

app.post('/api/persons', async (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    });
  }

  try { 
    const existingPerson = await Person.findOne({ name: body.name} );

    if (existingPerson) { 
      const updatedPerson = await Person.findByIdAndUpdate(
        existingPerson._id,
        { name: body.name, number: body.number },
        { new: true }
      );
      return res.json(updatedPerson);
    }
  const person = new Person({
    name: body.name,
    number: body.number
  });
  const savedPerson = await person.save();
  res.json(savedPerson);
  } catch (error) {
    next(error);
  }
});

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) { 
    return res.status(400).json({
      error: 'name or number missing'
    });
  }
  Person.findByIdAndUpdate(
    req.params.id,
    { name, number }, 
    { new: true }
  ).then(updatedPerson => {
    if (updatedPerson) { 
      res.json(updatedPerson);
    } else { 
      res.status(404).json({ error: 'person not found' });
    }
  }).catch(error => next(error));
});
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});