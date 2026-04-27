
const Listing = require("../models/listing");
const custExpressErr = require("../utilities/custExpressErr");

//required multer npm package for file upload in express app it parse file data
const multer = require("multer");

// required cloud storage configration 
const { storage } = require("../cloudConfig.js")

//here we are calling multer passing argument that is place where you want to store client sent file
const upload = multer({
    storage,
    limits: {
        fileSize: 1 * 1024 * 1024//5mb limit
    }
});

module.exports.showAllListingController = async (req, res, next) => {

    const allListings = await Listing.find();

    if (allListings.length === 0) {

        throw new custExpressErr("No listings found!", 404);

    } else {

        res.render("listings/index.ejs", { allListings });

    }

}

module.exports.createNewListingFormController = (req, res) => {

    res.render("listings/new.ejs");

}

module.exports.submitedNewListingFormController = async (req, res, next) => {

    upload.single("listing[image]")(req, res, async (err) => {
        // upload.single is a midlware that is calling manually to perform task
        //and attached function controle the execution 

        if (err) {

            req.flash("error", "failed image size is more then 1MB");

            return res.redirect("/listings/new");

        }
        if (!req.file) {

            req.flash("error", "Please upload image");

            return res.redirect("/listings/new");

        }

        let url = req.file.path;

        let filename = req.file.filename;

        const listing = new Listing(req.body.listing);

        listing.owner = req.user._id;

        listing.image = { url, filename }

        // here we set the owner property of the listing to the currently logged in user using req.user object 
        // which is available when we use passport middleware in our application/app and 
        // it will store the user information in the session and it is available in req.user object
        // when we use passport middleware in our application/app

        await listing.save();

        //here flash message is set in req.flash() method and 
        // it will be access in all views templates because we set flash message in res.locals in app.js file 
        // so we can access flash message in all views templates without send flash message manually in
        // all routes handler automatic send flash  message using middleware in all views templates because 
        // we set flash message in res.locals in app.js file
        //local object is used to store data that can be accessed in all views templates and 
        // it is available in all views templates because we set flash message in res.locals in app.js file 
        // so we can access flash message in all views templates without send flash message manually in 
        // all routes handler automatic send flash message in all views templates because we set flash message in res.locals in app.js file

        req.flash("success", "New listing created successfully!");

        res.redirect("/listings");

    });

}

module.exports.showSpecificeListingController = async (req, res, next) => {

    const { id } = req.params;

    const listing = await Listing.findById(id).populate("owner").populate({ path: "reviews", populate: { path: "author" } });

    //we cant use dot notation for array ,here review is an array that holds many review object id 
    // first outer populate is executed and then we get review objects in array then second inner populate is exrcuted 
    //all review object of review array hold author field that valuue is object id inner populate function populate it 

    if (!listing) {

        throw new custExpressErr("Listing not found!", 404);
    }

    res.render("listings/show.ejs", { listing });

}

module.exports.editListingFormController = async (req, res, next) => {

    const { id } = req.params;

    const listing = await Listing.findById(id);

    let originalImageUrl = listing.image.url;

    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_100");

    if (!listing) {

        throw new custExpressErr("Listing not found!", 404);
    }

    res.render("listings/edit.ejs", { listing, originalImageUrl });

}

module.exports.editedListingFormController = async (req, res, next) => {

    const { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    //body hold textual data that are cooming from form form data divided into two
    // part first is textual data that is hold by body and second is files that is hold by req.file object

    if (typeof req.file !== "undefined") {

        let url = req.file.path;

        let filename = req.file.filename;

        listing.image = { url, filename };

        await listing.save();

        //here flash message is set in req.flash() method and it will be access in all views templates because
        //  we set flash message in res.locals in app.js file so we can access flash message in all views templates without send flash message manually in all routes handler automatic send flash message in all views templates because we set flash message in res.locals in app.js file
        //local object is used to store data that can be accessed in all views templates and 
        // it is available in all views templates because we set flash message in res.locals in app.js file so we can access flash message in 
        // all views templates without send flash message manually in all routes handler automatic send flash message in all views templates because 
        // we set flash message in res.locals in app.js file
        req.flash("success", "Listing updated successfully!");

        return res.redirect(`/listings`);


    } else {

        req.flash("success", "Listing updated successfully!");

        return res.redirect(`/listings`);

    }

}

module.exports.deleteListingController = async (req, res, next) => {

    const { id } = req.params;

    await Listing.findByIdAndDelete(id);

    //here flash message is set in req.flash() method and it will be access in all views templates because we set flash message in res.locals in app.js file so we can access flash message in all views templates without send flash message manually in all routes handler automatic send flash message in all views templates because we set flash message in res.locals in app.js file
    //local object is used to store data that can be accessed in all views templates and it is available in all views templates because we set flash message in res.locals in app.js file so we can access flash message in all views templates without send flash message manually in all routes handler automatic send flash message in all views templates because we set flash message in res.locals in app.js file

    req.flash("success", "Listing deleted successfully!");

    res.redirect("/listings");

}