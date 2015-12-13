var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
  author: String,
  rating: {type: Number, required: true, min: 0, max: 5},
  reviewText: String,
  createdOn: {type: Date, "default": Date.now}
});

var arrangerSchema = new mongoose.Schema({
  name: {name: String, required: false},
  emailAddress: String,
  rating: {type: Number, "default": 0, min: 0, max: 5},
  specialties: [String],
  reviews: [reviewSchema]
});

mongoose.model('Arranger', arrangerSchema);
