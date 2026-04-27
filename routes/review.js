//require express and create router object with mergeParams option to access params from parent router to child app.js file written codeis parent  
// in this case listing router because review router is nested in listing router and 
// we need to access listing id from review router to store review 
// in the correct listing and also to delete review from the correct listing
const express = require('express');
const router = express.Router({ mergeParams: true });

//required the review model for controling the review collection 
const Review = require("../models/review.js");

//required listing model to controle/deal with listing collection 
const Listing = require("../models/listing.js");

//required mongoose to dael with mongo db
const mongoose = require('mongoose');

//required wrapAsync function for async error handling 
const wrapAsync = require("../utilities/wrapAsync.js");

//required custom express error class for handling error in express application
const custExpressErr = require("../utilities/custExpressErr.js");

//required review schema validator for validating review data before store in database
const reviewSchemaValidator = require("../reviewSchemaValidate.js");

//required importent midlware
const { idValidate, reviewSchemaValidate, isLoggedIn, isReviewOwner } = require("../midlware.js");

//required all review controllers
const { submitReviewController, deleteReviewController } = require("../controllers/reviews.js");

//it route for store review in db
router.post("/", idValidate, reviewSchemaValidate, isLoggedIn, wrapAsync(submitReviewController));

// it route for delete review 
router.delete("/:reviewId", isLoggedIn, isReviewOwner, wrapAsync(deleteReviewController));
//export router object 
module.exports = router;








































