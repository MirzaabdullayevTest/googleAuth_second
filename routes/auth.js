const { Router } = require('express')
const router = Router()
const passport = require('passport')

router.get('/google',
    passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/dashboard');
    });


router.get('/logout', (req, res) => {
    req.logOut()
    req.session.destroy()
    res.redirect('/')
})

module.exports = router