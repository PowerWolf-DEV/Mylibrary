const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('../middleware/checkauth')

router.get('/', checkAuthenticated, (req, res) => {
  res.render('profile', {
    title: 'Profile',
    name: req.user.name
  })
})

module.exports = router