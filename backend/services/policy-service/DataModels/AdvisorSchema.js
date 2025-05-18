const mongoose = require('mongoose');

const advisorSchema = new mongoose.Schema({
  name: String,
  experience: Number,
  rating: Number,
  city: String,
  expertise: String,
  image: String
});

module.exports = mongoose.model('Advisor', advisorSchema);
