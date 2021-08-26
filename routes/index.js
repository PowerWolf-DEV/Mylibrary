const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const { checkAuthenticated } = require('../middleware/checkAuth')

router.get('/', checkAuthenticated, async (req, res) => {
  let books
  try {
    books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch (err) {
    books = []
  }
  res.render('index', { 
    books: books,
    name: req.user.name,
    title: 'Mybrary'
  })
})

module.exports = router