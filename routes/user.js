const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utilities/wrapAsync.js");
const passport = require('passport');

//reuired all user controllers
const {
	signupFormController,
	signupSubmitedFormController,
	LoginFormController,
	loginSubmittedFormController,
	logoutController
} = require("../controllers/users.js");

//passport is authentication middleware for node.js and it is used to authenticate user in our application/app 
// and it provides a lot of strategies for authentication like local strategy, google strategy, facebook strategy, etc. 
// and we are using local strategy for authentication in our application and
//  it is used to authenticate user with username and password and
//  it is provided by passport-local-mongoose plugin that we used in user schema/model to add the functionality of passport-local-mongoose to the user schema/model

// Signup routes
router.get("/signup", signupFormController);
router.post("/signup", signupSubmitedFormController);

// Login routes
router.get("/login", LoginFormController);
router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), loginSubmittedFormController);

// Logout route
router.get("/logout", logoutController);


module.exports = router;


