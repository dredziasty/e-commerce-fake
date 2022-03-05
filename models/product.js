const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  imageSmall: {
    type: String,
    required: true
  },
  imageLarge: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Product', productSchema, 'products')