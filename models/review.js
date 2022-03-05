const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Review', reviewSchema, 'reviews')