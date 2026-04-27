const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const custExpressErr = require("../utilities/custExpressErr.js");

module.exports.submitReviewController = async (req, res, next) => {

    const { id } = req.params;

    const userReview = req.body.review;

    const modelCheckedReviewDocu = new Review(userReview);

    modelCheckedReviewDocu.author = req.user._id;

    const reviewEmptyListing = await Listing.findById(id);

    reviewEmptyListing.reviews.push(modelCheckedReviewDocu);

    console.log(modelCheckedReviewDocu);

    await modelCheckedReviewDocu.save();

    await reviewEmptyListing.save();
    
    //here flash message is set in req.flash() method and it will be access in all views templates because we set flash message in res.locals in app.js file so we can access flash message in all views templates without send flash message manually in all routes handler automatic send flash message in all views templates because we set flash message in res.locals in app.js file
    //local object is used to store data that can be accessed in all views templates and it is available in all views templates because we set flash message in res.locals in app.js file so we can access flash message in all views templates without send flash message manually in all routes handler automatic send flash message in all views templates because we set flash message in res.locals in app.js file

    req.flash("success", "Review added successfully!");

    res.redirect(`/listings/${id}`);

}

module.exports.deleteReviewController = async (req, res, next) => {

    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    await Review.findByIdAndDelete(reviewId);

    //here flash message is set in req.flash() method and it will be access in all views templates because we set flash message in res.locals in app.js file so we can access flash message in all views templates without send flash message manually in all routes handler automatic send flash message in all views templates because we set flash message in res.locals in app.js file
    //local object is used to store data that can be accessed in all views templates and it is available in all views templates because we set flash message in res.locals in app.js file so we can access flash message in all views templates without send flash message manually in all routes handler automatic send flash message in all views templates because we set flash message in res.locals in app.js file

    req.flash("success", "Review deleted successfully!");

    res.redirect(`/listings/${id}`);

}
