const mongoose = require('mongoose');
const { Schema } = mongoose;

const newsSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true }
});

// Define the model
const News = mongoose.model('News', newsSchema);

module.exports = News;
