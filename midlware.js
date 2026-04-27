const mongoose = require('mongoose');
const listingSchemaValidate = require("./schemaValidate.js");
const reviewSchemaValidator = require("./reviewSchemaValidate.js");
const custExpressErr = require("./utilities/custExpressErr.js");
const wrapAsync = require("./utilities/wrapAsync.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");


//schema validation middleware 
const schemaValidate = (req, res, next) => {

    const result = listingSchemaValidate.validate(req.body);

    if (result.error) {

        let errMsg = result.error.details.map((el) =>

            el.message).join(",");

        return next(new custExpressErr(errMsg, 400));

    } else {
        next();
    }

}

//it midleware validate the id comming from client side in url as parameter
const idValidate = (req, res, next) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {

        return next(new custExpressErr("Invalid listing ID!", 400));

        //!mongoose.Types.ObjectId.isValid(id) is used to check valid id or not 
        //it not check authenticity (correct or not)  of id only check formate of id 24 charecter hex string or not

    } else {
        next();
    }
}

//logged in middleware for authentication, user logged in or not
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        //req.isAuthenticated() is a method provided by passport to check if the user is authenticated or not in session not in db and 
        //becoz it session also store user information when user login to the website not in sign in using passport authentication middleware 
        //it will create a session for the login user and store the user information in the session and
        // it user info is available in req.user object when we use passport middleware in our application/app
        //it check session is expired or not if expire the again login is required and if session is valid then it will return true 
        //and if the user is not authenticated then it will return false and if the user is authenticated then it will return true
        // when user login to the website using passport authentication middleware it will create a session for the user and store the user information in the session and 
        // when user make a request to the server it will check the session for the user information and if the session is valid 
        // then it will authenticate the user and allow access to the protected routes otherwise 
        // it will redirect to the login page or flash a message and redirect to the login page based on the options provided in the authenticate function
        // if user is not authenticated then it will return false and if the user is authenticated then it will return true and if the user is not authenticated 
        // then it will return false 

        req.flash("error", "You must be logged in for  this!");
        return res.redirect("/login");
    } else {
        next();
    }
};


//isOwner middleware for authorization to check the owner of the listing and allow access to edit and delete listing only for the owner of the listing
const isOwner = wrapAsync(async (req, res, next) => {

    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing.owner.equals(req.user._id)) {

        // here listing.owner is the object id of the owner of the listing 
        // and req.user._id is the object id of the currently logged in user id using 
        // which is available when we use passport middleware in our application/app and 
        // it will store the user information in the session and it is available in req.user object
        // when we use passport middleware in our application/app
        // equals() method is used to compare the object id of the owner of the listing with the object id of the currently logged in user using req.user object 
        // which is available when we use passport middleware in our application/app and 
        // it will store the user information in the session and it is available in req.user object
        // when we use passport middleware in our application/app and it will return true if both object id are same and
        // it will return false if both object id are different and
        // here js comparison operator (===) is not used to compare the object id because 
        // it will compare the reference of the object and it will return false even if both object id are same because they are different objects in memory and

        req.flash("error", "You are not authorized to do this!");

        return res.redirect(`/listings/${id}`);
        
    } else {

        next(); 
    }

});

//review schema validator midlware
const reviewSchemaValidate = (req, res, next) => {

    const result = reviewSchemaValidator.validate(req.body);


    if (result.error) {

        let errMsg = result.error.details.map((el) =>

            el.message).join(",");

        return next(new custExpressErr(errMsg, 1111));

    } else {
        next();
    }

}


//is owner middleware for authorization user is owner of the listing or not
const isReviewOwner = wrapAsync(async (req, res, next) => {

    const { id, reviewId } = req.params;

    const listing = await Review.findById(reviewId);

    if (!listing.author.equals(req.user._id)) {

        //here listing.owner is the object id of the owner of the listing and req.user._id is the object id of the currently logged in user using req.user object 
        // which is available when we use passport middleware in our application/app and it will store the user information in the session and it is available in req.user object when we use passport middleware in our application/app
        // equals() method is used to compare the object id of the owner of the listing with the object id of the currently logged in user using req.user object 
        // which is available when we use passport middleware in our application/app and 
        // it will store the user information in the session and it is available in req.user object
        //  when we use passport middleware in our application/app and it will return true if both object id are same and it will return false if both object id are different and
        //here js comparison operator (===) is not used to compare the object id because it will compare the reference of the object and it will return false 
        // even if both object id are same because they are different objects in memory and

        req.flash("error", "You are not authorized to do this!");

        return res.redirect(`/listings/${id}`);
        
    } else {
        next(); 
    }
});

module.exports = { schemaValidate, idValidate, isOwner, isLoggedIn, isReviewOwner, reviewSchemaValidate }


