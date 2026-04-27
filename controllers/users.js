const User = require("../models/user.js");
const wrapAsync = require("../utilities/wrapAsync.js");
const passport = require('passport');

module.exports.signupFormController = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signupSubmitedFormController = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            } else {
                req.flash("success", "Welcome to Wanderlust");
                res.redirect("/listings");
            }
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.LoginFormController = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.loginSubmittedFormController = (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    res.redirect("/listings");
};

module.exports.logoutController = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        } else {
            req.flash("success", "You have been logged out!");
            res.redirect("/listings");
        }
    });
};



