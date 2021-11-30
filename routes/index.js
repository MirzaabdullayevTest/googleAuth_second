const express = require('express')
const router = express.Router()
const authMidlleware = require('../middleware/authMidlleware')

//@desc  Login/landing page
//@route GET /
router.get('/', (req, res) => {
    res.render('login', {
        layout: 'login',
        title: 'Login'
    })
})

//@desc  Dashboard
//@route GET /dashboard
router.get('/dashboard', authMidlleware, (req, res) => {
    res.render('dashboard', {
        title: 'Dashboard'
    })
})

module.exports = router