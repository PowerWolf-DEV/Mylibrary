const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const { checkNotAuthenticated } = require('../middleware/checkauth')

const User = require('../models/user')
const initializePassport = require('../middleware/passport-config')
initializePassport(passport)

router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('auth/login', { title: 'Login' })
})

router.post('/login', checkNotAuthenticated, passport.authenticate('local', { 
  successRedirect: '/profile',
  failureRedirect: '/auth/login', 
  failureFlash: true
}))

router.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('auth/register', { title: 'Register' })
})

router.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10)
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword
    })
    await user.save()
    res.redirect('/auth/login')
  } catch(err) {
    res.redirect('/auth/register', {
      title: 'Error',
      errorMessage: 'Error creating user'
    })
  }
})

router.delete('/logout', async (req, res) => {
  req.logOut()
  res.redirect('/auth/login')
})

module.exports = router