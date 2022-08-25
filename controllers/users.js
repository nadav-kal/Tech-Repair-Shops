const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.register = catchAsync(async (req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Tech Repaire Shops Website!!!');
            res.redirect('/techrepairs');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }

});

module.exports.renderLogin = (req, res) => {
    if(req.query.returnTo) {
        req.session.returnTo = req.query.returnTo;
    }
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = res.locals.returnTo || '/techrepairs';
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {

    req.logout(function(err) {
        if (err) { 
            return next(err); 
        }
        req.flash('success', 'Goodbye!');
        return res.redirect('/techrepairs');
    });

};