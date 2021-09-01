const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { checkNotAuthenticated } = require('../middleware/checkauth')
const { registerValidators } = require('../utils/validators')
const { validationResult } = require('express-validator')

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
  let name = req.session.name
  let email = req.session.email
  res.render('auth/register', { 
    title: 'Register',
    registerError: req.flash('registerError'),
    name,
    email
  })
})

router.post('/register', registerValidators, checkNotAuthenticated, async (req, res) => {
  try {
    const { name, email, password } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.flash('registerError', errors.array()[0].msg)
      req.session.name = name
      req.session.email = email
      return res.status(422).redirect('/auth/register')
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const user = new User({
      name, email, password: hashPassword
    })
    await user.save()
    res.redirect('/auth/login')
  } catch(err) {
    console.log(err)
  }
})

router.delete('/logout', async (req, res) => {
  req.logOut()
  req.session.destroy()
  res.redirect('/auth/login')
})

module.exports = router