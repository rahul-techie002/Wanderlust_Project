const mongoose = require('mongoose');
const Review = require('../models/review.js');
const User = require('../models/user.js');
const { string } = require('joi');

//defining schema
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true

    },
    description: {
        type: String,
        required: true

    },
    image: {

        url:String,
        
        filename:String,

    },

    price: {
        
        type: Number,
        default: 0,
        required: true
    },
    location: {

        type: String,
        required: true
    },

    country: {

        type: String,
        required: true
    },
    reviews: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",

    }],

    owner: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "User",    
        
    }   

});

///mongoose middleware that execute when we delete a listing using findOneAndDelete command in your server file 
// then it midleware is executed and delete all self attached data that is attached with listing like review

 listingSchema.post("findOneAndDelete", async (listing) => {

    if (listing) {

        await Review.deleteMany({ _id: { $in: listing.reviews } });

    }

});

//creating model
const Listing = mongoose.model("Listings", listingSchema);

module.exports = Listing;
