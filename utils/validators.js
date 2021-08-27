const { body } = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
  body('email')
    .isEmail().withMessage('Enter the valid email')
    .custom(async (value, {req}) => {
      try {
        const user = await User.findOne({email: value})
        if (user) {
          return Promise.reject('This email is already registered')
        }
      } catch (e) {
        console.log(e)
      }
    })
    .normalizeEmail(),
  body('password', 'Password must be at least 6 symbols')
    .isLength({min:6, max:20})
    .isAlphanumeric()
    .trim(),
  body('name')
    .isLength({min: 3})
    .withMessage('Name must be at least 3 symbols')
    .trim()
]

exports.loginValidators = [
  body('email')
    .isEmail().withMessage('Enter the valid email')
    .normalizeEmail(),
  body('password', 'Password must be at least 6 symbols')
    .isLength({min:6, max:20})
    .isAlphanumeric()
    .trim(),
]