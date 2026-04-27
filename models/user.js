const mongoose = require('mongoose');

//this library used to create schema thats why we import it here
//mongoose is object foe data modling for mongodb and it provides a schema based solution to model our application/app data and
//it also provides a lot of features like validation, middleware, etc. to work with mongodb in an easy way
const passportLocalMongoose = require('passport-local-mongoose').default;

//definig schema 
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passportLocalMongoose);

//passport atomatically add username and hash field and salt field to the schema place of password field 
//when we use passportLocalMongoose plugin;
//hash field is used to store the hashed password and salt field is used to store the salt value for hashing the password
// each time user register the password is hashed with a unique salt value and stored in the hash field and the salt value is stored in the salt field
//when user login the password is hashed with the same salt value and compared with the hash field to authenticate the user
//plugin is function that can be used to add functionality to a schema in mongoose and it is used to add the functionality of passport-local-mongoose to the user schema
//passport-local-mongoose is the  function that pass as argument to the plugin function and it is used to add the functionality of passport-local-mongoose to the user schema

module.exports = mongoose.model('User', userSchema);






















