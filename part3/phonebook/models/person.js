import mongoose from 'mongoose';
import 'dotenv/config'
import process from 'process';

const url = process.env.MONGODB_URI;

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: { 
    type: String,
    minLength: 3, 
    required: true
  }, 
  number: { 
    type: String,
    minLength: 8,
    required: true,
    validate: { 
      validator: function(v) {
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number`
    }
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Person = mongoose.model('Person', personSchema);

export default Person

