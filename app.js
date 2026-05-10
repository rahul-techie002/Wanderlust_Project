if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

//require express and create app object
const express = require('express');
const app = express();
const port = 3000;

//setting mongoose npm package help to connect with mongoDB&controle database in express
const mongoose = require('mongoose');

//setting path for node js where what files&folder exists
const path = require("path");

//require utilities
const custExpressErr = require("./utilities/custExpressErr.js");

//setting express- session npm package for session management in express
const session = require('express-session');
//setting Up session storage for store session related data
const {MongoStore} = require('connect-mongo');



//setting connect-flash npm package for flash messages in express
const flash = require('connect-flash');



//required router objects for handling routes related to listing, review and user
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//setting up for method override npm package that overide your request on server, comming from client side
const methodOverride = require('method-override');

//setting up passport npm package and passport-local  for authentication in express app
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user.js");

//setting up ejs mate npm package  
const engine = require('ejs-mate');
const Listing = require("./models/listing.js");
app.engine('ejs', engine);

//setting up path for static files like css, js, images etc. in express app
app.use(express.static(path.join(__dirname, 'public')));

//setting up path for views templates in express app
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

//setting up middleware for parsing form url encoded data, comming from client side 
app.use(express.urlencoded({ extended: true }));
//setting up middleware for parsing json data,if comming from client side
app.use(express.json());

// setting methodOverride npm package that overide your request on server, comming from client side 
app.use(methodOverride('_method'));

const dbUrl = process.env.ATLASDB_URL;

//server file connection to database
async function main() {
    await mongoose.connect(dbUrl);
}

main()
    .then((result) => {
        console.log("your server file connected to DB!")
    })
    .catch((err) => {
        console.log("your connection fail to DB?", err);
    });




const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
    //session will be updated after 24 hour not for each request for same user
})

//exppress-session middleware for session management in express app
app.use(session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 day
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day,
        httpOnly: true,
    }
}));

//passport middleware for authentication in expressapp and 
// it should be after express-session middleware because
// passport use session to store user information 
// when user login to the website using passport authentication middleware
// it will create a session for the user and store the user information in the session and
// when user make a request to the server it will check the session for the user information and
// if the session is valid then it will authenticate the user and allow access to the protected routes otherwise
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//connect-flash middleware for flash messages in express app
app.use(flash());

//middleware set flash messages in res.locals and other data that you want to send for access in all views/ejs templates/front end
app.use((req, res, next) => {

    res.locals.success = req.flash("success");

    res.locals.error = req.flash("error");

    res.locals.currentUser = req.user;

    next();
});

//middleware handle listings releted routes
app.use("/listings", listingsRouter);

//middleware handle the reviews related routes 
app.use("/listings/:id/reviews", reviewsRouter);

//middleware handle the user related routes
app.use("/", userRouter);

////////////////////////////////
//extra activity

app.get("/search", async (req, res) => {

    const { search } = req.query;

    const listings = await Listing.find({ $or: [{ title: `${search}` }, { location: `${search}` }, { country: `${search}` }] });

    if (listings.length > 0) {

        res.render("listings/search.ejs", { listings });

    }
    else {
        req.flash("error", "Destination not found");
        res.redirect("/listings");
    }

});

//it route for wrong request
app.get(/.*/, (req, res) => {

    throw new custExpressErr(" Page Not Found Requested Wrong Route!", 404);

});

// custom error handling middleware
app.use((err, req, res, next) => {

    const { statusCode = 500, message = "Internal Server Error!" } = err;

    res.render("listings/error.ejs", { statusCode, message });
});

// app is listening on port 3000
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

//hi rahul pathak














