const express = require('express');
const passport = require('passport');
const router = express.Router();
const passportAuthenticate = passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'});
const users = require('../controllers/users');
const {checkReturnTo} = require('../middleware');

router.route('/register')
    .get(users.renderRegister)
    .post(users.register);

router.route('/login')
    .get(users.renderLogin)
    .post(checkReturnTo, passportAuthenticate,  users.login);

router.get('/logout', users.logout);

module.exports = router;