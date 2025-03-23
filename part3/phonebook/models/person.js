import mongoose from 'mongoose';
import 'dotenv/config'

const url = process.env.MONGODB_URI;

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

export default mongoose.model('Person', personSchema);

