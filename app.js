require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userModel = require('./models/user')
const productModel = require('./models/product')
const reviewModel = require('./models/review')
const cookieSession = require('cookie-session')

const app = express()

app.use(express.json())
app.use(express.static(`${__dirname}/public`))
app.use(cookieSession({
  name: 'session',
  keys: ['key', 'key2']
}))
app.set('view engine', 'ejs')

app.get('/', async(req, res) => {
  try {
    const products = await productModel.find()

    res.render('index', {
      products
    })
  } catch (error) {

  }
})

app.get('/products/:sku', async(req, res) => {
  try {
    const product = await productModel.findOne({ sku: req.params.sku })
    const reviews = await reviewModel.find({ productId: product._id }).sort({ createdAt: -1 })
    const userId = req.session.userId
    let canAddReview = false

    if (userId) {
      const user = await userModel.findById(userId)
      canAddReview = !!user.orderedProducts.find(orderedProduct => orderedProduct.toString() === product._id.toString())
    }

    res.render('product', {
      product,
      reviews,
      canAddReview
    })
  } catch (error) {
    console.error(error)
    return res.status(500)
  }
})

app.post('/api/auth/register', async(req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body

    const hash = await bcrypt.hash(password, +process.env.SALT)

    const newUser = new userModel({
      email,
      firstname,
      lastname,
      password: hash
    })
    await newUser.save()

    return res.status(201).json()
  } catch (error) {
    console.error(error)
    return res.status(500)
  }
})

app.post('/api/auth/login', async(req, res) => {
  try {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })
    if (!user)
      return res.status(404).json({ message: 'User not found' })

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: 'Invalid password' })

    req.session.userId = user._id
    return res.status(200).json({ userId: user._id, firstname: user.firstname })
  } catch (error) {
    console.error(error)
    return res.status(500)
  }
})

app.post('/api/auth/logout', async(req, res) => {
  req.session = null
  return res.status(204).json()
})

app.post('/api/products/:productId/buy', async(req, res) => {
  try {
    const userId = req.session.userId

    if (!userId) {
      return res.status(401).json({ message: 'You must be logged in to buy the product.' })
    }

    await userModel.findOneAndUpdate({ _id: userId }, {
      $push: {
        orderedProducts: req.params.productId
      }
    })

    return res.status(200).json()
  } catch (error) {
    console.error(error)
    return res.status(500)
  }
})

app.post('/api/reviews', async(req, res) => {
  try {
    const userId = req.session.userId

    if (!userId) {
      return res.status(401).json({ message: 'You must be logged in to add the review.' })
    }

    const { productId, rate, name, review } = req.body

    const newReview = new reviewModel({
      productId,
      userId,
      rate,
      name,
      review
    })
    await newReview.save()

    return res.status(201).json()
  } catch (error) {
    console.error(error)
    return res.status(500)
  }
})

const start = async() => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('Database connected')

    app.listen(process.env.PORT, () => {
      console.log(`App is running on port: ${process.env.PORT}`)
    })
  } catch (error) {
    console.error(error);
  }
}

start()