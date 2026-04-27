//required express and create router object
const express = require('express');
const router = express.Router();

//required mongoose to deal/communicate with mongo DB
const mongoose = require('mongoose');

//required listing model to deal with listing collection in mongo DB
const Listing = require("../models/listing.js");

//required review model to deal with review collection in mongo DB
const Review = require("../models/review.js");

/// required wrapAsync function to handle async error in route/router 
const wrapAsync = require("../utilities/wrapAsync.js");

//required custom express error class to handle error in route/router
const custExpressErr = require("../utilities/custExpressErr.js");

//required schema validator Joi npm package
const listingSchemaValidate = require("../schemaValidate.js");

//requred importent midlware
const{schemaValidate, idValidate, isLoggedIn,isOwner } = require("../midlware.js");

//required multer npm package for file upload in express app it parse file data
const multer = require("multer");

// required cloud storage configration 
const{storage} = require("../cloudConfig.js")

//here we are calling multer passing argument that is place where you want to store client sent file
const upload = multer({ storage ,
  limits:{
    fileSize :1 * 1024 * 1024//5mb limit
  }
});

//required all listing controllers
const { 
  showAllListingController, 
  createNewListingFormController, 
  submitedNewListingFormController, 
  showSpecificeListingController,
  editListingFormController,
  editedListingFormController,
  deleteListingController
} = require('../controllers/listings.js');

//it route show all listings/index route
router.get("/", wrapAsync(showAllListingController));

// it route for new listing
//get request
router.get("/new", isLoggedIn, createNewListingFormController);

// and post request
router.post("/new", schemaValidate, isLoggedIn,  wrapAsync(submitedNewListingFormController));

//it route show the specific listing 
router.get("/:id", idValidate, wrapAsync(showSpecificeListingController));

//it route for edit listing form
//get request for edit listing form
router.get("/:id/edit", idValidate, isLoggedIn, wrapAsync(editListingFormController));

//and put request to save edited/updated listing form data to database
router.put("/:id", idValidate, schemaValidate, isLoggedIn, isOwner, upload.single("listing[image]"),  wrapAsync(editedListingFormController));
//upload.single("listing[image]") can be used here in route you can 
//upload.single("listing[image]") it is a midleware here we are telling to multer
// client single file exist in this comming through the form , field is  listing[image]
// you can take from here to upload ,parse it and upload above declared place given to you /
// storage place already declared configred above to you/multer
//and give control next midleware to handle request then next give control next midlware if like this 

//it route for delete listing
router.delete("/:id", idValidate, isLoggedIn, isOwner, wrapAsync(deleteListingController));

//exprt router object 
module.exports = router;



